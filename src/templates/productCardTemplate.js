// 商品卡片模板
export const productCardTemplate = `
    <div class="col-12">
        <div class="card card-product border-0 rounded-0">
            <div class="row">
                <div class="col-12 col-xl-4 col-lg-5 col-md-4">
                    <a href="/products/{{product_id}}">
                        <img src="{{thumbnail}}" class="img-fluid rounded-0" alt="{{product_name}}">
                    </a>
                </div>
                <div class="col-12 col-xl-8 col-lg-7 col-md-8">
                    <div class="card-body ps-0 pe-0">
                        <h3 class="card-title fw-normal fs-4">
                            <a href="/products/{{product_id}}" class="link-body-emphasis">{{product_name}}</a>
                        </h3>
                        <div class="card-text">
                            <div class="mb-3">
                                <span class="text-secondary">Price:</span>
                                <span class="fs-5">
                                    <strong class="text-danger">{{price}}</strong>
                                </span>
                            </div>
                            <p>{{description}}</p>
                        </div>
                        <div>
                            <a href="/products/{{product_id}}" class="btn btn-lg fs-6 btn-dark rounded-0">
                                <i class="bi bi-bag"></i>
                                <span>查看详细</span>
                            </a>
                            <button type="button" class="btn-like btn btn-lg fs-6 btn-outline-dark rounded-0" data-product-id="{{product_id}}" data-product-name="{{product_name}}" data-product-price="{{price}}">
                                <i class="bi bi-heart text-secondary"></i>
                                <span>收藏</span>
                            </button>
                        </div>
                    </div>
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

// 生成商品列表HTML
export function generateProductsHtml(products) {
    const html = products.map(product => 
        replaceTemplateVariables(productCardTemplate, product)
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
                        button.classList.remove('btn-outline-dark');
                        button.classList.add('btn-dark');
                        heartIcon.classList.remove('text-secondary');
                        heartIcon.classList.add('text-white');
                    } else {
                        button.classList.remove('btn-dark');
                        button.classList.add('btn-outline-dark');
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
                        const productImage = this.closest('.card-product').querySelector('img').src;
                        
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