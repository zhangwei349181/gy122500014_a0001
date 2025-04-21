/**
 * 生成标签列表的HTML
 * @param {Array} tags - 标签数组
 * @param {string} currentTagId - 当前选中的标签ID
 * @returns {string} 生成的HTML字符串
 */
export function generateTagListHtml(tags, currentTagId) {
    if (!tags || !Array.isArray(tags)) {
        return '';
    }

    return tags.map(tag => {
        const isActive = tag.tag_id.toString() === currentTagId;
        return `
            <li class="nav-item">
                <a class="nav-link ${isActive ? 'active' : ''}" 
                   href="/productstag/${tag.tag_id}-1">
                    ${tag.name || tag.tag_name}
                    <span class="badge bg-secondary ms-2">${tag.product_count || 0}</span>
                </a>
            </li>
        `;
    }).join('');
} 