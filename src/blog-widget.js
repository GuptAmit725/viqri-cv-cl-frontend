// ============================================
// Blog Widget for Homepage
// Displays top 10 most recent blog posts
// ============================================

class BlogWidget {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            limit: options.limit || 10,
            showExcerpt: options.showExcerpt !== false,
            showTags: options.showTags !== false,
            showImages: options.showImages !== false,
            ...options
        };
        this.blogs = [];
    }

    async init() {
        try {
            await this.loadBlogs();
            this.render();
        } catch (error) {
            console.error('Error initializing blog widget:', error);
            this.renderError();
        }
    }

    async loadBlogs() {
        const response = await fetch('blog/blog-data.json');
        const data = await response.json();
        
        // Sort by date (newest first) and limit
        this.blogs = data.blogs
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, this.options.limit);
    }

    render() {
        if (!this.container) {
            console.error('Blog widget container not found');
            return;
        }

        const html = `
            <div class="blog-widget">
                <div class="blog-widget-header">
                    <h2 class="blog-widget-title">Latest from Our Blog</h2>
                    <a href="blog/blogs.html" class="blog-widget-view-all">
                        View All Articles
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>
                <div class="blog-widget-grid">
                    ${this.blogs.map(blog => this.createBlogCard(blog)).join('')}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.addStyles();
    }

    createBlogCard(blog) {
        const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <a href="blog/posts/${blog.id}.html" class="blog-widget-card">
                ${this.options.showImages && blog.image ? `
                    <div class="blog-widget-card-image" style="background-image: url('${blog.image}')"></div>
                ` : ''}
                <div class="blog-widget-card-content">
                    ${blog.featured ? '<div class="blog-widget-badge">⭐ Featured</div>' : ''}
                    <div class="blog-widget-card-meta">
                        <span>${formattedDate}</span>
                        <span>•</span>
                        <span>${blog.readTime}</span>
                    </div>
                    <h3 class="blog-widget-card-title">${blog.title}</h3>
                    ${this.options.showExcerpt ? `
                        <p class="blog-widget-card-excerpt">${blog.excerpt}</p>
                    ` : ''}
                    ${this.options.showTags ? `
                        <div class="blog-widget-card-tags">
                            ${blog.tags.slice(0, 3).map(tag => `<span class="blog-widget-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </a>
        `;
    }

    renderError() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="blog-widget-error">
                <p>Unable to load blog posts at this time.</p>
            </div>
        `;
    }

    addStyles() {
        // Check if styles already added
        if (document.getElementById('blog-widget-styles')) return;

        const style = document.createElement('style');
        style.id = 'blog-widget-styles';
        style.textContent = `
            .blog-widget {
                padding: 60px 0;
            }

            .blog-widget-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 40px;
                flex-wrap: wrap;
                gap: 20px;
            }

            .blog-widget-title {
                font-family: var(--font-display, 'Syne', sans-serif);
                font-size: 2.5rem;
                font-weight: 800;
                color: white;
                margin: 0;
            }

            .blog-widget-view-all {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                color: white;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .blog-widget-view-all:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateX(4px);
            }

            .blog-widget-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 24px;
            }

            .blog-widget-card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                overflow: hidden;
                text-decoration: none;
                color: inherit;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
            }

            .blog-widget-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.4);
            }

            .blog-widget-card-image {
                width: 100%;
                height: 200px;
                background-size: cover;
                background-position: center;
                background-color: rgba(102, 126, 234, 0.2);
            }

            .blog-widget-card-content {
                padding: 20px;
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .blog-widget-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                background: rgba(251, 191, 36, 0.2);
                border: 1px solid rgba(251, 191, 36, 0.4);
                border-radius: 12px;
                font-size: 0.7rem;
                color: #fbbf24;
                margin-bottom: 12px;
                width: fit-content;
            }

            .blog-widget-card-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 12px;
            }

            .blog-widget-card-title {
                font-family: var(--font-display, 'Syne', sans-serif);
                font-size: 1.25rem;
                font-weight: 700;
                color: white;
                margin: 0 0 12px 0;
                line-height: 1.3;
            }

            .blog-widget-card-excerpt {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9rem;
                line-height: 1.5;
                margin: 0 0 16px 0;
                flex: 1;
            }

            .blog-widget-card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: auto;
            }

            .blog-widget-tag {
                padding: 4px 10px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.9);
            }

            .blog-widget-error {
                text-align: center;
                padding: 40px;
                color: rgba(255, 255, 255, 0.7);
            }

            @media (max-width: 768px) {
                .blog-widget-title {
                    font-size: 2rem;
                }

                .blog-widget-grid {
                    grid-template-columns: 1fr;
                }

                .blog-widget-header {
                    flex-direction: column;
                    align-items: flex-start;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const blogWidgetContainer = document.getElementById('blogWidgetContainer');
    if (blogWidgetContainer) {
        const widget = new BlogWidget('blogWidgetContainer', {
            limit: 10,
            showExcerpt: true,
            showTags: true,
            showImages: true
        });
        widget.init();
    }
});