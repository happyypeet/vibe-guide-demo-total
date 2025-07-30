import { Project } from '@/lib/db/schema';

export interface DocumentType {
  key: keyof Project;
  label: string;
  icon: string;
}

export const documentTypes: DocumentType[] = [
  { key: 'userJourneyMap', label: '用户旅程地图', icon: '🗺️' },
  { key: 'productRequirements', label: '产品需求PRD', icon: '📋' },
  { key: 'frontendDesign', label: '前端设计文档', icon: '🎨' },
  { key: 'backendDesign', label: '后端设计文档', icon: '⚙️' },
  { key: 'databaseDesign', label: '数据库设计', icon: '🗄️' },
];

export class DocumentExporter {
  static downloadMarkdown(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    this.downloadFile(blob, `${filename}.md`);
  }

  static downloadHTML(content: string, filename: string) {
    const htmlContent = this.convertMarkdownToHTML(content);
    const fullHTML = this.wrapInHTMLTemplate(htmlContent, filename);
    const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
    this.downloadFile(blob, `${filename}.html`);
  }

  static async downloadProjectZip(project: Project) {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // 添加项目基本信息
    const projectInfo = `# ${project.title}

## 项目描述
${project.description}

${project.requirements ? `## 需求分析
${project.requirements}` : ''}

创建时间：${new Date(project.createdAt).toLocaleString('zh-CN')}
最后更新：${new Date(project.updatedAt).toLocaleString('zh-CN')}
`;
    zip.file('项目信息.md', projectInfo);

    // 添加各类文档
    documentTypes.forEach(({ key, label }) => {
      const content = project[key];
      if (content && typeof content === 'string') {
        zip.file(`${label}.md`, content);
        
        // 同时生成HTML版本
        const htmlContent = this.convertMarkdownToHTML(content);
        const fullHTML = this.wrapInHTMLTemplate(htmlContent, label);
        zip.file(`${label}.html`, fullHTML);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    this.downloadFile(blob, `${project.title}-文档包.zip`);
  }

  private static downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static convertMarkdownToHTML(markdown: string): string {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 text-gray-800 mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-3 text-gray-700 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-medium mb-2 text-gray-700 mt-4">$1</h4>')
      .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/gim, '</p><p class="mb-4 leading-relaxed text-gray-700">')
      .replace(/\n/gim, '<br>');
  }

  private static wrapInHTMLTemplate(content: string, title: string): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - VibeGuide</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
        }
        .content {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }
        ul, ol {
            list-style: disc;
            margin-left: 1.5rem;
            margin-bottom: 1rem;
        }
        ol {
            list-style: decimal;
        }
        pre {
            background-color: #f7fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin-bottom: 1rem;
        }
        blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #4b5563;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="content">
        <div class="mb-8 pb-4 border-b border-gray-200">
            <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-white font-bold">V</span>
                </div>
                <span class="text-gray-600 font-medium">VibeGuide</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">${title}</h1>
            <p class="text-gray-600 mt-2">生成时间：${new Date().toLocaleString('zh-CN')}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-8">
            <p class="mb-4 leading-relaxed text-gray-700">${content}</p>
        </div>
        
        <div class="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>此文档由 VibeGuide AI 智能生成 | <a href="https://vibeguide.com" class="text-blue-600 hover:underline">vibeguide.com</a></p>
        </div>
    </div>
</body>
</html>`;
  }

  static previewHTML(markdown: string): string {
    const htmlContent = this.convertMarkdownToHTML(markdown);
    return `<div class="prose max-w-none">${htmlContent}</div>`;
  }
}