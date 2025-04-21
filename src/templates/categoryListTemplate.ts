import type { Category } from '../types/category';

export function generateCategoryListHtml(categories: Category[], currentCategoryId: string): string {
    function generateCategoryItem(cat: Category, level = 0): string {
        const isActive = cat.category_id.toString() === currentCategoryId;
        const hasChildren = cat.children && cat.children.length > 0;
        const indentClass = level > 0 ? `ms-${level * 4}` : '';
        
        let html = `
            <li class="nav-item">
                <a class="nav-link ${level === 0 ? 'pt-1 pb-1 ps-0 pe-0' : 'p-0'} ${indentClass} ${isActive ? 'link-primary' : 'link-body-emphasis'} ${level === 0 ? 'fw-medium' : ''}"
                   href="/productslist/${cat.category_id}-1">
                    ${cat.category_name}
                </a>`;
        
        if (hasChildren && cat.children) {
            html += `
                <ul class="nav flex-column ms-4">
                    ${cat.children.map(child => generateCategoryItem(child, level + 1)).join('')}
                </ul>`;
        }
        
        html += '</li>';
        return html;
    }
    
    return categories.map(cat => generateCategoryItem(cat)).join('');
} 