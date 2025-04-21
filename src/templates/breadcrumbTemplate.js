// 面包屑导航模板
export const breadcrumbTemplate = `
<ol class="breadcrumb mb-3 text-secondary justify-content-center">
    <li class="breadcrumb-item">
        <a href="/" class="link-dark">首页</a>
    </li>
    {{#each items}}
    <li class="breadcrumb-item">
        {{#if isLast}}
        <span aria-current="page">{{name}}</span>
        {{else}}
        <a href="{{url}}" class="link-dark">{{name}}</a>
        {{/if}}
    </li>
    {{/each}}
</ol>
`;

// 替换模板中的变量
export function replaceTemplateVariables(template, data) {
    let result = template;

    // 处理each循环
    result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, key, content) => {
        if (!data[key] || !Array.isArray(data[key])) {
            console.log(`Warning: ${key} is not an array or is undefined`);
            return '';
        }
        return data[key].map(item => {
            let itemContent = content;
            
            // 先替换普通变量
            Object.entries(item).forEach(([k, v]) => {
                itemContent = itemContent.replace(new RegExp(`{{${k}}}`, 'g'), v);
                console.log(`Replacing {{${k}}} with ${v}`);
            });

            // 处理内容中的if-else条件
            itemContent = itemContent.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, ifContent, elseContent) => {
                const value = item[key];
                console.log(`Checking if-else condition for ${key}:`, value);
                return value ? ifContent : elseContent;
            });

            // 处理类名中的if条件
            itemContent = itemContent.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
                const value = item[key];
                console.log(`Checking if condition for ${key}:`, value);
                return value ? content : '';
            });

            return itemContent;
        }).join('');
    });

    return result;
}

// 生成面包屑导航HTML
export function generateBreadcrumbHtml(breadcrumbItems) {
    console.log('Generating breadcrumb HTML with items:', breadcrumbItems);
    const result = replaceTemplateVariables(breadcrumbTemplate, { items: breadcrumbItems });
    console.log('Generated breadcrumb HTML:', result);
    return result;
} 