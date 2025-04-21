 // 分页模板
export const paginationTemplate = `
<section class="py-5">
    <div class="container">
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center mb-0">
                {{#if showPrev}}
                <li class="page-item">
                    <a class="page-link rounded-0" href="/productstag/{{categoryId}}-{{prevPage}}">
                        <i class="bi bi-chevron-left"></i>
                    </a>
                </li>
                {{/if}}
                
                {{#each pages}}
                <li class="page-item {{#if isActive}}active{{/if}}">
                    <a class="page-link rounded-0" href="/productstag/{{../categoryId}}-{{page}}">
                        {{page}}
                    </a>
                </li>
                {{/each}}
                
                {{#if showNext}}
                <li class="page-item">
                    <a class="page-link rounded-0" href="/productstag/{{categoryId}}-{{nextPage}}">
                        <i class="bi bi-chevron-right"></i>
                    </a>
                </li>
                {{/if}}
            </ul>
        </nav>
    </div>
</section>
`;

// 生成分页数据
export function generatePaginationData(categoryId, pagination) {
    const { current_page, total_pages } = pagination;
    
    // 生成页码数组
    const pages = Array.from({ length: total_pages }, (_, i) => i + 1).map(page => ({
        page,
        isActive: page === current_page
    }));

    return {
        categoryId,
        showPrev: current_page > 1,
        showNext: current_page < total_pages,
        prevPage: current_page - 1,
        nextPage: current_page + 1,
        pages
    };
}

// 替换模板中的变量
export function replaceTemplateVariables(template, data) {
    return template
        .replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
            return data[key] ? content : '';
        })
        .replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, key, content) => {
            return data[key].map(item => {
                let itemContent = content;
                // 替换当前项中的变量
                Object.entries(item).forEach(([k, v]) => {
                    itemContent = itemContent.replace(new RegExp(`{{${k}}}`, 'g'), v);
                });
                // 替换父级变量
                Object.entries(data).forEach(([k, v]) => {
                    if (typeof v !== 'object' || !Array.isArray(v)) {
                        itemContent = itemContent.replace(new RegExp(`{{../${k}}}`, 'g'), v);
                    }
                });
                return itemContent;
            }).join('');
        })
        .replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || match;
        });
}

// 生成分页HTML
export function generatePaginationHtml(categoryId, pagination) {
    const data = generatePaginationData(categoryId, pagination);
    return replaceTemplateVariables(paginationTemplate, data);
}