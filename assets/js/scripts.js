async function renderDomainList() {
    try {
        const response = await fetch('./assets/json/domains.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const domainData = await response.json();

        const domainList = document.getElementById('domainList');
        if (!domainList) return;
        domainList.innerHTML = '';

        let tarikkoIndex = 1;
        let index;
        domainData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'domain-item';

            index = Object.prototype.hasOwnProperty.call(item, 'album') ? item.index : tarikkoIndex;

            const indexFullWidth = String(index).replace(/[0-9]/g, char =>
                String.fromCharCode(char.charCodeAt(0) + 0xFEE0)
            );

            const link = document.createElement('a');
            link.href = /^https?:\/\//i.test(item.domain) ? item.domain : `https://${item.domain}`;
            link.className = 'domain-link';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'domain-name';

            const titleText = document.createTextNode(
                item.title || item.domain.toUpperCase()
            );
            const subtitleSpan = document.createElement('span');
            subtitleSpan.className = 'domain-subname';
            subtitleSpan.textContent = item.title && item.subtitle ? `　〜 ${item.subtitle}` : '';

            nameSpan.append(titleText, subtitleSpan);

            const urlSpan = document.createElement('span');
            urlSpan.className = 'domain-url';
            urlSpan.textContent = item.domain || '';

            link.append(nameSpan, urlSpan);

            const albumIndex = document.createElement('div');
            albumIndex.className = 'domain-album-index';
            albumIndex.textContent = `
                『${item.album || '幻想界域巡錄　～ Compendium of Tarikko\'s Realms'}』 ${indexFullWidth}．
            `;

            li.append(link, albumIndex);

            domainList.appendChild(li);

            if (!Object.prototype.hasOwnProperty.call(item, 'album')) {
                tarikkoIndex++;
            }

        });
    } catch (error) {
        const domainList = document.getElementById('domainList');
        if (domainList) {
            domainList.innerHTML = '<li class="loading">加载域名列表失败</li>';
        }
        console.error('Error loading domain data:', error);
    }
}

renderDomainList();