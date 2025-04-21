// 商品网格卡片模板
export const productGridCardTemplate = `
    <div class="col-12 col-lg-4 col-md-6">
        <div class="card card-product text-center border-0 rounded-0">
            <div class="card-img-box position-relative overflow-hidden">
                <a href="/products/{{product_id}}" class="card-img-link">
                    <img src="{{thumbnail}}" class="card-img-top rounded-0" alt="{{product_name}}">
                </a>
                <a href="/products/{{product_id}}" class="btn-add-cart btn btn-lg btn-dark w-100 fs-6 rounded-0 bottom-0 start-0 position-absolute">
                    <i class="bi bi-bag"></i>
                    <span>查看详细</span>
                </a>
                <button type="button" class="btn-like fs-6 btn btn-lg p-0 position-absolute top-0 end-0 rounded-circle mt-3 me-3 bg-white" data-product-id="{{product_id}}" data-product-name="{{product_name}}" data-product-price="{{price}}">
                    <i class="bi bi-heart text-secondary"></i>
                </button>
            </div>
            <div class="card-body">
                <h5 class="card-title fw-normal">
                    <a href="/products/{{product_id}}" class="link-body-emphasis">
                        {{product_name}}
                    </a>
                </h5>
                <div class="card-text">
                    <strong class="text-danger">{{price}}</strong>
                </div>
            </div>
        </div>
    </div>
`;

// 替换模板中的变量
export function replaceTemplateVariables(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match;
    });
}

// 生成商品网格HTML
export function generateProductsGridHtml(products) {
    const html = products.map(product => 
        replaceTemplateVariables(productGridCardTemplate, product)
    ).join('');

    // 添加收藏功能的脚本
    const script = `
        <script>
            // 检查并更新收藏按钮状态
            function updateWishlistButtonState() {
                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                document.querySelectorAll('.btn-like').forEach(button => {
                    const productId = button.dataset.productId;
                    const isWishlisted = wishlist.some(item => item.product_id.toString() === productId);
                    const heartIcon = button.querySelector('.bi-heart');
                    
                    if (isWishlisted) {
                        button.classList.remove('bg-white');
                        button.classList.add('bg-danger');
                        heartIcon.classList.remove('text-secondary');
                        heartIcon.classList.add('text-white');
                    } else {
                        button.classList.remove('bg-danger');
                        button.classList.add('bg-white');
                        heartIcon.classList.remove('text-white');
                        heartIcon.classList.add('text-secondary');
                    }
                });
            }

            // 为所有收藏按钮添加点击事件
            document.querySelectorAll('.btn-like').forEach(button => {
                button.addEventListener('click', function() {
                    try {
                        // 获取产品信息
                        const productId = this.dataset.productId;
                        const productName = this.dataset.productName;
                        const productPrice = parseFloat(this.dataset.productPrice.replace('¥', ''));
                        const productImage = this.closest('.card-img-box').querySelector('.card-img-top').src;
                        
                        // 获取现有收藏数据
                        const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                        
                        // 检查产品是否已经在收藏列表中
                        const isAlreadyWishlisted = existingWishlist.some(item => item.product_id.toString() === productId);
                        
                        if (isAlreadyWishlisted) {
                            // 如果已收藏，则取消收藏
                            const updatedWishlist = existingWishlist.filter(item => item.product_id.toString() !== productId);
                            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                            alert('已取消收藏');
                        } else {
                            // 如果未收藏，则添加到收藏
                            const wishlistItem = {
                                product_id: parseInt(productId),
                                product_name: productName,
                                product_image: productImage,
                                price: productPrice,
                                timestamp: new Date().toISOString()
                            };
                            existingWishlist.push(wishlistItem);
                            localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
                            alert('已添加到收藏列表');
                        }
                        
                        // 更新按钮状态
                        updateWishlistButtonState();
                        
                        // 触发自定义事件，通知其他组件收藏列表已更新
                        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
                    } catch (error) {
                        console.error('收藏操作失败:', error);
                        alert('操作失败：' + error.message);
                    }
                });
            });

            // 页面加载时检查收藏状态
            document.addEventListener('DOMContentLoaded', updateWishlistButtonState);

            // 监听收藏列表更新事件
            window.addEventListener('wishlistUpdated', updateWishlistButtonState);
        </script>
    `;

    return html + script;
} 