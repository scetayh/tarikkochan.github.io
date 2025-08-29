// 渲染域名列表
async function renderDomainList() {
    try {
        const response = await fetch('/assets/json/domains.json');
        const domainData = await response.json();
        
        const domainList = document.getElementById('domainList');
        domainList.innerHTML = ''; // 清空加载提示
        
        domainData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'domain-item';
            
            li.innerHTML = `
                <a href="https://${item.domain}.tarikkochan.top" class="domain-link" target="_blank">
                    <span class="domain-name">${item.title}<span class="domain-subname">　〜 ${item.subtitle}</span></span>
                    <span class="domain-url">${item.domain}.tarikkochan.top</span>
                </a>
                <div class="domain-desc">『${item.albumtitle}　〜 ${item.albumsubtitle}』 ${item.number}．</div>
            `;
            
            domainList.appendChild(li);
        });
    } catch (error) {
        document.getElementById('domainList').innerHTML = 
            '<li class="loading">加载域名列表失败，请稍后重试</li>';
        console.error('Error loading domain data:', error);
    }
}

// 添加樱花装饰元素
function createCherryBlossoms() {
    const body = document.querySelector('body');
    const blossomCount = Math.min(15, Math.floor(window.innerWidth / 50));
    
    for (let i = 0; i < blossomCount; i++) {
        const blossom = document.createElement('div');
        blossom.classList.add('cherry-blossom');
        
        // 随机位置
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // 随机大小
        const size = 5 + Math.random() * 10;
        
        // 随机透明度
        const opacity = 0.3 + Math.random() * 0.4;
        
        blossom.style.left = `${left}vw`;
        blossom.style.top = `${top}vh`;
        blossom.style.width = `${size}px`;
        blossom.style.height = `${size}px`;
        blossom.style.opacity = opacity;
        
        body.appendChild(blossom);
    }
}

// 页面加载时执行
window.addEventListener('load', function() {
    renderDomainList();
    createCherryBlossoms();
});

// 调整窗口大小时重新布置樱花
window.addEventListener('resize', function() {
    document.querySelectorAll('.cherry-blossom').forEach(el => el.remove());
    createCherryBlossoms();
});