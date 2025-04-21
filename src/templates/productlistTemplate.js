// 商品卡片模板
export const productCardTemplate = `
    <div class="col-12">
        <div class="card card-product border-0 rounded-0">
            <div class="row">
                <div class="col-12 col-xl-4 col-lg-5 col-md-4">
                    <a href="/product/{{product_id}}">
                        <img src="{{thumbnail}}" class="img-fluid rounded-0" alt="{{product_name}}">
                    </a>
                </div>
                <div class="col-12 col-xl-8 col-lg-7 col-md-8">
                    <div class="card-body ps-0 pe-0">
                        <h3 class="card-title fw-normal fs-4">
                            <a href="/product/{{product_id}}" class="link-body-emphasis">{{product_name}}</a>
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
                            <a href="shopping-cart.html" class="btn btn-lg fs-6 btn-dark rounded-0">
                                <i class="bi bi-bag"></i>
                                <span>Add to cart</span>
                            </a>
                            <a href="wishlist.html" class="btn btn-lg fs-6 btn-outline-dark rounded-0">
                                <i class="bi bi-heart"></i>
                                <span>wishlist</span>
                            </a>
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
export function generateProductslistHtml(products) {
    return products.map(product => 
        replaceTemplateVariables(productCardTemplate, product)
    ).join('');
} 
