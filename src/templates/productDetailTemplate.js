// 生成商品图片轮播HTML
export function generateProductImagesHtml(images) {
    // 过滤掉缩略图，只保留其他类型的图片
    const galleryImages = images.filter(img => img.image_type !== 'thumbnail');
    
    // 生成轮播图HTML
    const carouselHtml = `
        <div id="crsPhoto" class="carousel carousel-dark slide mb-5 mb-md-0">
            <div class="carousel-inner mb-3">
                ${galleryImages.map((img, index) => `
                    <a href="${img.image_url}" class="carousel-item ${index === 0 ? 'active' : ''} glightbox" 
                       data-gallery="photos" 
                       data-glightbox="title: ${img.product_name}" 
                       data-bs-interval="10000">
                        <img src="${img.image_url}" class="d-block w-100" alt="${img.product_name}">
                    </a>
                `).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#crsPhoto" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#crsPhoto" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;

    return { carouselHtml, thumbnailsHtml: '' };
}

// 递归查找分类
function findCategory(cats, targetId) {
    for (const cat of cats) {
        if (cat.category_id === targetId) {
            return cat;
        }
        if (cat.children) {
            const found = findCategory(cat.children, targetId);
            if (found) return found;
        }
    }
    return null;
}

// 生成商品详情HTML
export async function generateProductDetailHtml(product) {
    const { carouselHtml, thumbnailsHtml } = generateProductImagesHtml(product.images);

    // 获取标签数据
    const tagsModule = await import('../data/products/tags/tags.js');
    const tags = tagsModule.default;

    // 获取分类数据
    const categoriesModule = await import('../data/products/categories/categories.js');
    const categories = categoriesModule.default;

    // 根据tag_ids匹配标签信息
    const productTags = product.tag_ids.map(tagId => {
        const tag = tags.find(t => t.tag_id === tagId);
        return tag ? {
            tag_id: tag.tag_id,
            name: tag.tag_name
        } : null;
    }).filter(Boolean);

    // 根据category_ids查找对应的分类信息
    const productCategories = product.category_ids.map(categoryId => {
        return findCategory(categories, categoryId);
    }).filter(Boolean);

    // 处理参数信息
    const parameters = product.details
        .filter(detail => detail.extra_info === 'parameter')
        .map(detail => ({
            key: detail.detail_key,
            value: detail.detail_value
        }));

    // 处理商品描述信息
    const description01 = product.details
        .filter(detail => detail.extra_info === 'Description')
        .map(detail => ({
            key: detail.detail_key,
            value: detail.detail_value
        }));

    return {
        carouselHtml,
        thumbnailsHtml,
        product: {
            name: product.product_name,
            description: product.description,
            tags: productTags,
            categories: productCategories,
            parameters: parameters,
            description01: description01
        }
    };
} 