// 生成商品选项和购买信息HTML
import regionsData from '../data/products/region.js';
import shipTaxData from '../data/products/ship_tax.js';

export function generateProductPurchaseHtml(product) {
    // 获取所有变体
    const variants = product.variants || [];
    
    // 获取所有选项
    const options = product.options || [];
    
    // 获取区域数据
    const regions = regionsData.regions || [];
    
    // 获取运费和税费数据
    const shippingData = shipTaxData.shipping || [];
    const taxData = shipTaxData.tax || [];
    
    // 判断是否有变体
    const hasVariants = variants.length > 0 && options.length > 0;
    
    // 计算价格范围或使用基础价格
    let priceDisplay;
    if (hasVariants) {
        const prices = variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        priceDisplay = minPrice === maxPrice ? `¥${minPrice}` : `¥${minPrice} - ¥${maxPrice}`;
    } else {
        priceDisplay = `¥${product.price}`;
    }
    
    // 生成选项HTML
    const optionsHtml = hasVariants ? options.map(option => {
        return `
            <div class="mb-4">
                <h6>选择${option.option_name}:</h6>
                <ul class="list-inline mb-0">
                    ${option.values.map(value => `
                        <li class="list-inline-item me-1">
                            <div class="mb-2">
                                <input type="radio" class="btn-check variant-selector" 
                                       name="${option.option_name}-group" 
                                       id="${option.option_name}${value.value_id}"
                                       data-option-id="${option.option_id}"
                                       data-value-id="${value.value_id}"
                                       data-value="${value.value}">
                                <label class="btn btn-sm btn-outline-secondary mw-sm rounded-0" 
                                       for="${option.option_name}${value.value_id}">
                                    ${value.value}
                                </label>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }).join('') : '';

    // 生成购买信息HTML
    const purchaseHtml = `
        <div class="product-purchase-info">
            <div class="mb-3">
                <div>
                    <span class="text-secondary">价格:</span>
                    <strong class="text-danger fs-4" id="product-price">${priceDisplay}</strong>
                </div>
            </div>
            <div class="mb-3">
                <span class="text-secondary">SKU:</span>
                <span class="text-body fw-medium" id="product-sku">${hasVariants ? '请选择变体' : `#${product.product_id}`}</span>
            </div>
            <div class="mb-3">
                <span class="text-secondary">库存:</span>
                <span class="text-success fw-medium" id="product-stock">${hasVariants ? '请选择变体' : '有货'}</span>
            </div>
            ${optionsHtml}
            <div class="mb-4">
                <h6>数量:</h6>
                <div class="row">
                    <div class="col-6 col-lg-4 col-md-6">
                        <div class="input-group input-group-lg">
                            <input type="number" 
                                   class="form-control fs-6 shadow-none rounded-0" 
                                   value="1" 
                                   min="1" 
                                   id="product-quantity"
                                   ${hasVariants ? 'disabled' : ''}>
                            <button class="btn btn-dark fs-6 rounded-0" 
                                    id="btnAddToCart"
                                    ${hasVariants ? 'disabled' : ''}>
                                <i class="bi bi-bag lh-1"></i>
                                <span>加入购物车</span>
                            </button>
                        </div>
                    </div>
                    <div class="col-6 col-lg-4 col-md-6">
                        <button class="btn btn-lg fs-6 btn-outline-dark rounded-0" id="btnAddToWishlist">
                            <i class="bi bi-heart lh-1"></i>
                            <span>收藏</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mb-4">
                <h6 class="fs-6">收货区域:</h6>
                <select class="form-select form-select-sm rounded-0" id="shipping-region">
                    <option value="">请选择收货区域</option>
                    ${regions.map(region => `
                        <option value="${region.region_id}">${region.region_name}</option>
                    `).join('')}
                </select>
            </div>
            <div class="mb-3">
                <div class="d-flex justify-content-between">
                    <span class="text-secondary small">产品运费:</span>
                    <span class="text-body small" id="shipping-fee">¥0.00</span>
                </div>
            </div>
            <div class="mb-3">
                <div class="d-flex justify-content-between">
                    <span class="text-secondary small">产品税费:</span>
                    <span class="text-body small" id="tax-fee">¥0.00</span>
                </div>
            </div>
        </div>
        ${hasVariants ? `
        <script>
            // 存储用户选择的变体值
            const selectedValues = new Map();
            
            // 运费和税费数据
            const shippingData = ${JSON.stringify(shippingData)};
            const taxData = ${JSON.stringify(taxData)};
            
            // 计算运费
            function calculateShipping(quantity, regionId) {
                if (!regionId) return 0;
                
                // 获取产品的运费模板
                const shippingTemplate = shippingData.find(template => 
                    ${JSON.stringify(product.shipping_template_ids)}.includes(template.template_id)
                );
                
                if (!shippingTemplate) return 0;
                
                // 查找区域规则
                const regionRule = shippingTemplate.rules.find(rule => rule.region_id === parseInt(regionId));
                if (!regionRule) return shippingTemplate.default_fee || 0;
                
                // 计算运费
                const firstUnit = regionRule.first_unit;
                const firstFee = regionRule.first_fee;
                const additionalUnit = regionRule.additional_unit;
                const additionalFee = regionRule.additional_fee;
                
                if (quantity <= firstUnit) return firstFee;
                
                const additionalQuantity = Math.ceil((quantity - firstUnit) / additionalUnit);
                return firstFee + (additionalQuantity * additionalFee);
            }
            
            // 计算税费
            function calculateTax(price, quantity, regionId) {
                if (!regionId) return 0;
                
                // 获取产品的税费模板
                const taxTemplate = taxData.find(template => 
                    ${JSON.stringify(product.tax_template_ids)}.includes(template.template_id)
                );
                
                if (!taxTemplate) return 0;
                
                // 查找区域规则
                const regionRule = taxTemplate.rules.find(rule => rule.region_id === parseInt(regionId));
                if (!regionRule) return (price * quantity * taxTemplate.default_tax_rate) / 100;
                
                // 计算税费
                return (price * quantity * regionRule.tax_rate) / 100;
            }
            
            // 更新费用显示
            function updateFees() {
                const quantity = parseInt(document.getElementById('product-quantity').value) || 0;
                const regionId = document.getElementById('shipping-region').value;
                const price = parseFloat(document.getElementById('product-price').textContent.replace('¥', ''));
                
                const shippingFee = calculateShipping(quantity, regionId);
                const taxFee = calculateTax(price, quantity, regionId);
                
                document.getElementById('shipping-fee').textContent = '¥' + shippingFee.toFixed(2);
                document.getElementById('tax-fee').textContent = '¥' + taxFee.toFixed(2);
            }
            
            // 监听数量变化
            document.getElementById('product-quantity').addEventListener('change', updateFees);
            
            // 监听区域变化
            document.getElementById('shipping-region').addEventListener('change', updateFees);
            
            // 提交购物车数据
            function submitToCart(data) {
                try {
                    // 检查所选区域是否在可销售区域内
                    const allowedRegions = ${JSON.stringify(product.region_ids)};
                    if (!allowedRegions.includes(parseInt(data.region_id))) {
                        alert('该产品暂无法销售到您选择的区域');
                        return;
                    }
                    
                    // 获取现有购物车数据
                    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                    
                    // 添加新商品
                    existingCart.push(data);
                    
                    // 保存到localStorage
                    localStorage.setItem('cart', JSON.stringify(existingCart));
                    
                    console.log('购物车提交成功:', data);
                    alert('已添加到购物车');
                } catch (error) {
                    console.error('购物车提交失败:', error);
                    alert('添加到购物车失败：' + error.message);
                }
            }
            
            // 变体选择器
            document.querySelectorAll('.variant-selector').forEach(radio => {
                radio.addEventListener('change', function() {
                    const optionId = this.dataset.optionId;
                    const valueId = this.dataset.valueId;
                    selectedValues.set(optionId, valueId);
                    
                    // 检查是否所有选项都已选择
                    const allOptionsSelected = ${JSON.stringify(options)}.every(option => 
                        selectedValues.has(option.option_id.toString())
                    );
                    
                    if (allOptionsSelected) {
                        // 获取所有选中的值ID
                        const selectedValueIds = Array.from(selectedValues.values());
                        
                        // 查找匹配的变体
                        const variant = ${JSON.stringify(variants)}.find(v => {
                            const variantValueIds = v.option_values;
                            return selectedValueIds.every(id => 
                                variantValueIds.includes(parseInt(id))
                            );
                        });
                        
                        if (variant) {
                            // 更新价格
                            document.getElementById('product-price').textContent = '¥' + variant.price;
                            
                            // 更新SKU
                            document.getElementById('product-sku').textContent = '#' + variant.sku;
                            
                            // 更新库存状态
                            let stockText = "无货";
                            if (variant.stock > 0) {
                                stockText = "有货 (" + variant.stock + "件)";
                            }
                            document.getElementById('product-stock').textContent = stockText;
                            
                            // 更新数量输入框
                            const quantityInput = document.getElementById('product-quantity');
                            quantityInput.max = variant.stock;
                            quantityInput.disabled = variant.stock <= 0;
                            
                            // 更新加入购物车按钮
                            const addToCartBtn = document.getElementById('btnAddToCart');
                            addToCartBtn.disabled = variant.stock <= 0;
                            
                            // 更新费用
                            updateFees();
                        }
                    } else {
                        // 重置显示
                        document.getElementById('product-price').textContent = '${priceDisplay}';
                        document.getElementById('product-sku').textContent = '请选择变体';
                        document.getElementById('product-stock').textContent = '请选择变体';
                        document.getElementById('product-quantity').disabled = true;
                        document.getElementById('btnAddToCart').disabled = true;
                        document.getElementById('shipping-fee').textContent = '¥0.00';
                        document.getElementById('tax-fee').textContent = '¥0.00';
                    }
                });
            });

            // 添加购物车按钮点击事件
            document.getElementById('btnAddToCart').addEventListener('click', function() {
                const quantity = document.getElementById('product-quantity').value;
                const sku = document.getElementById('product-sku').textContent;
                const price = document.getElementById('product-price').textContent;
                const regionId = document.getElementById('shipping-region').value;
                
                // 获取当前选中的变体
                const selectedValueIds = Array.from(selectedValues.values());
                const variant = ${JSON.stringify(variants)}.find(v => {
                    const variantValueIds = v.option_values;
                    return selectedValueIds.every(id => 
                        variantValueIds.includes(parseInt(id))
                    );
                });
                
                // 计算费用
                const shippingFee = calculateShipping(parseInt(quantity), regionId);
                const taxFee = calculateTax(parseFloat(price.replace('¥', '')), parseInt(quantity), regionId);
                
                // 构建提交数据
                const cartData = {
                    product_id: ${product.product_id},
                    product_name: ${JSON.stringify(product.product_name)},
                    product_image: ${JSON.stringify(
                        product.images.find(img => img.image_type === 'thumbnail')?.image_url || 
                        product.images[0]?.image_url || ''
                    )},
                    sku: sku.replace('#', ''),
                    price: parseFloat(price.replace('¥', '')),
                    stock: variant ? variant.stock : 0,
                    quantity: parseInt(quantity),
                    shipping_fee: shippingFee,
                    tax_fee: taxFee,
                    region_id: regionId,
                    timestamp: new Date().toISOString()
                };
                
                // 输出提交数据到控制台
                console.log('准备提交购物车数据:', cartData);
                
                // 提交数据
                submitToCart(cartData);
            });

            // 添加收藏功能
            document.getElementById('btnAddToWishlist').addEventListener('click', function() {
                try {
                    // 获取现有收藏数据
                    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                    
                    // 检查产品是否已经在收藏列表中
                    const isAlreadyWishlisted = existingWishlist.some(item => item.product_id === ${product.product_id});
                    
                    if (isAlreadyWishlisted) {
                        alert('该产品已在收藏列表中');
                        return;
                    }
                    
                    // 构建收藏数据
                    const wishlistItem = {
                        product_id: ${product.product_id},
                        product_name: ${JSON.stringify(product.product_name)},
                        product_image: ${JSON.stringify(
                            product.images.find(img => img.image_type === 'thumbnail')?.image_url || 
                            product.images[0]?.image_url || ''
                        )},
                        price: ${product.price},
                        timestamp: new Date().toISOString()
                    };
                    
                    // 添加到收藏列表
                    existingWishlist.push(wishlistItem);
                    
                    // 保存到localStorage
                    localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
                    
                    // 触发自定义事件，通知其他组件收藏列表已更新
                    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
                    
                    alert('已添加到收藏列表');
                } catch (error) {
                    console.error('添加到收藏失败:', error);
                    alert('添加到收藏失败：' + error.message);
                }
            });
        </script>
        ` : `
        <script>
            // 运费和税费数据
            const shippingData = ${JSON.stringify(shippingData)};
            const taxData = ${JSON.stringify(taxData)};
            
            // 计算运费
            function calculateShipping(quantity, regionId) {
                if (!regionId) return 0;
                
                // 获取产品的运费模板
                const shippingTemplate = shippingData.find(template => 
                    ${JSON.stringify(product.shipping_template_ids)}.includes(template.template_id)
                );
                
                if (!shippingTemplate) return 0;
                
                // 查找区域规则
                const regionRule = shippingTemplate.rules.find(rule => rule.region_id === parseInt(regionId));
                if (!regionRule) return shippingTemplate.default_fee || 0;
                
                // 计算运费
                const firstUnit = regionRule.first_unit;
                const firstFee = regionRule.first_fee;
                const additionalUnit = regionRule.additional_unit;
                const additionalFee = regionRule.additional_fee;
                
                if (quantity <= firstUnit) return firstFee;
                
                const additionalQuantity = Math.ceil((quantity - firstUnit) / additionalUnit);
                return firstFee + (additionalQuantity * additionalFee);
            }
            
            // 计算税费
            function calculateTax(price, quantity, regionId) {
                if (!regionId) return 0;
                
                // 获取产品的税费模板
                const taxTemplate = taxData.find(template => 
                    ${JSON.stringify(product.tax_template_ids)}.includes(template.template_id)
                );
                
                if (!taxTemplate) return 0;
                
                // 查找区域规则
                const regionRule = taxTemplate.rules.find(rule => rule.region_id === parseInt(regionId));
                if (!regionRule) return (price * quantity * taxTemplate.default_tax_rate) / 100;
                
                // 计算税费
                return (price * quantity * regionRule.tax_rate) / 100;
            }
            
            // 更新费用显示
            function updateFees() {
                const quantity = parseInt(document.getElementById('product-quantity').value) || 0;
                const regionId = document.getElementById('shipping-region').value;
                const price = ${product.price};
                
                const shippingFee = calculateShipping(quantity, regionId);
                const taxFee = calculateTax(price, quantity, regionId);
                
                document.getElementById('shipping-fee').textContent = '¥' + shippingFee.toFixed(2);
                document.getElementById('tax-fee').textContent = '¥' + taxFee.toFixed(2);
            }
            
            // 监听数量变化
            document.getElementById('product-quantity').addEventListener('change', updateFees);
            
            // 监听区域变化
            document.getElementById('shipping-region').addEventListener('change', updateFees);
            
            // 添加购物车按钮点击事件（无变体版本）
            document.getElementById('btnAddToCart').addEventListener('click', function() {
                const quantity = document.getElementById('product-quantity').value;
                const regionId = document.getElementById('shipping-region').value;
                
                // 计算费用
                const shippingFee = calculateShipping(parseInt(quantity), regionId);
                const taxFee = calculateTax(${product.price}, parseInt(quantity), regionId);
                
                // 构建提交数据（无变体版本）
                const cartData = {
                    product_id: ${product.product_id},
                    product_name: ${JSON.stringify(product.product_name)},
                    product_image: ${JSON.stringify(
                        product.images.find(img => img.image_type === 'thumbnail')?.image_url || 
                        product.images[0]?.image_url || ''
                    )},
                    sku: ${product.product_id},
                    price: ${product.price},
                    stock: 999999, // 无变体时显示无限库存
                    quantity: parseInt(quantity),
                    shipping_fee: shippingFee,
                    tax_fee: taxFee,
                    region_id: regionId,
                    timestamp: new Date().toISOString()
                };
                
                // 输出提交数据到控制台
                console.log('准备提交购物车数据:', cartData);
                
                // 提交数据
                submitToCart(cartData);
            });
            
            // 提交购物车数据
            function submitToCart(data) {
                try {
                    // 检查所选区域是否在可销售区域内
                    const allowedRegions = ${JSON.stringify(product.region_ids)};
                    if (!allowedRegions.includes(parseInt(data.region_id))) {
                        alert('该产品暂无法销售到您选择的区域');
                        return;
                    }
                    
                    // 获取现有购物车数据
                    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                    
                    // 添加新商品
                    existingCart.push(data);
                    
                    // 保存到localStorage
                    localStorage.setItem('cart', JSON.stringify(existingCart));
                    
                    console.log('购物车提交成功:', data);
                    alert('已添加到购物车');
                } catch (error) {
                    console.error('购物车提交失败:', error);
                    alert('添加到购物车失败：' + error.message);
                }
            }
        </script>
        `}
    `;

    return purchaseHtml;
}