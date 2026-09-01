function updateToolbarState() {
    document.querySelectorAll('[data-sort-key]').forEach(button => {
        const isActive = button.dataset.sortKey === domainState.sortKey;
        button.classList.toggle('is-active', isActive);
    });

    document.querySelectorAll('[data-direction]').forEach(button => {
        const isActive = button.dataset.direction === domainState.sortDirection;
        button.classList.toggle('is-active', isActive);
    });

    document.querySelectorAll('[data-filter]').forEach(button => {
        const isActive = button.dataset.filter === domainState.filterMode;
        button.classList.toggle('is-active', isActive);
    });
}

function bindToolbarControls() {
    document.querySelectorAll('[data-sort-key]').forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.sortKey;
            if (domainState.sortKey === key) {
                domainState.sortDirection = domainState.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                domainState.sortKey = key;
                domainState.sortDirection = 'asc';
            }
            persistState();
            renderDomainList();
        });
    });

    document.querySelectorAll('[data-direction]').forEach(button => {
        button.addEventListener('click', () => {
            domainState.sortDirection = button.dataset.direction;
            persistState();
            renderDomainList();
        });
    });

    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', () => {
            domainState.filterMode = button.dataset.filter;
            persistState();
            renderDomainList();
        });
    });
}

function createAlbumIndexText(item, index) {
    const indexFullWidth = String(index).replace(/[0-9]/g, char =>
        String.fromCharCode(char.charCodeAt(0) + 0xFEE0)
    );
    return `${indexFullWidth}．`;
}

function buildDomainItem(item, index, isAlbumGroupMode = false) {
    const li = document.createElement('li');
    li.className = 'domain-item';

    const isEnabled = getItemEnabled(item);
    if (!isEnabled) {
        li.classList.add('domain-item-disabled');
    }

    const link = document.createElement('a');
    link.className = 'domain-link';
    if (isEnabled) {
        link.href = /^https?:\/\//i.test(item.domain) ? item.domain : `https://${item.domain}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    } else {
        link.setAttribute('aria-disabled', 'true');
        link.tabIndex = -1;
    }

    const nameSpan = document.createElement('span');
    nameSpan.className = 'domain-name';

    if (isAlbumGroupMode) {
        const trackIndex = document.createElement('span');
        trackIndex.className = 'domain-track-index';
        trackIndex.textContent = createAlbumIndexText(item, index);
        nameSpan.appendChild(trackIndex);
    }

    const titleText = document.createTextNode(item.title || item.domain.toUpperCase());
    const subtitleSpan = document.createElement('span');
    subtitleSpan.className = 'domain-subname';
    subtitleSpan.textContent = item.title && item.subtitle ? `　〜 ${item.subtitle}` : '';

    nameSpan.append(titleText, subtitleSpan);

    const urlSpan = document.createElement('span');
    urlSpan.className = 'domain-url';
    urlSpan.textContent = item.domain || '';

    link.append(nameSpan, urlSpan);

    if (!isAlbumGroupMode) {
        const albumIndex = document.createElement('div');
        albumIndex.className = 'domain-album-index';
        const albumName = item.album || '幻想界域伝說　～ Gateway to the Wandering Tales.';
        albumIndex.textContent = `${item.author || ''}『${albumName}』 ${createAlbumIndexText(item, index)}`;
        li.append(link, albumIndex);
    } else {
        li.appendChild(link);
    }

    return li;
}

function renderAlbumGroups(sortedData) {
    const fragment = document.createDocumentFragment();
    const groups = new Map();

    sortedData.forEach(item => {
        const albumName = item.album || '幻想界域伝說　～ Gateway to the Wandering Tales.';
        if (!groups.has(albumName)) {
            groups.set(albumName, []);
        }
        groups.get(albumName).push(item);
    });

    groups.forEach((items, albumName) => {
        const orderedItems = [...items].sort((a, b) => compareValues(
            getAlbumLocalSortValue(a),
            getAlbumLocalSortValue(b),
            domainState.sortDirection
        ));
        const allDisabled = orderedItems.length > 0 && orderedItems.every(item => !getItemEnabled(item));
        const albumAuthor = orderedItems.find(item => item.author)?.author || '';

        const group = document.createElement('div');
        group.className = 'album-group';
        if (allDisabled) {
            group.classList.add('is-dimmed');
        }

        const header = document.createElement('div');
        header.className = 'album-group-header';
        header.textContent = albumAuthor ? `${albumAuthor}『${albumName}』` : `『${albumName}』`;
        group.appendChild(header);

        const list = document.createElement('ul');
        list.className = 'domain-list';

        orderedItems.forEach(item => {
            const li = buildDomainItem(item, getStableTrackIndex(item), true);
            list.appendChild(li);
        });

        group.appendChild(list);
        fragment.appendChild(group);
    });

    return fragment;
}

async function renderDomainList() {
    try {
        if (domainState.rawData.length === 0) {
            const response = await fetch('./assets/json/domains.json');
            if (!response.ok) throw new Error('Network response was not ok');
            domainState.rawData = await response.json();
        }

        const domainList = document.getElementById('domainList');
        if (!domainList) return;

        const visibleData = getFilteredDomainData();
        const sortedData = [...visibleData].sort(compareDomainItems);

        domainList.innerHTML = '';

        if (domainState.sortKey === 'album') {
            domainList.appendChild(renderAlbumGroups(sortedData));
        } else {
            sortedData.forEach(item => {
                const displayIndex = getStableTrackIndex(item);
                const li = buildDomainItem(item, displayIndex, false);
                domainList.appendChild(li);
            });
        }

        updateToolbarState();
    } catch (error) {
        const domainList = document.getElementById('domainList');
        if (domainList) {
            domainList.innerHTML = '<li class="loading">加载域名列表失败</li>';
        }
        console.error('Error loading domain data:', error);
    }
}

async function getLastCommitTime(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const commits = await response.json();
        if (commits.length === 0) {
            return null;
        }
        return commits[0].commit.author.date;
    } catch (error) {
        console.error('Error getting commit time:', error);
        return null;
    }
}

const TAISUI_YEAR_NAME = {
    2025: '強圉執徐',
    2026: '柔兆敦牂',
    2027: '著雍攝提格',
    2028: '玄黓敦牂',
    2029: '屠維上章'
};

const CHINESE_NUMERALS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function toChineseDay(value) {
    const n = Number(value);
    if (Number.isNaN(n) || n < 1 || n > 31) {
        return String(value ?? '');
    }

    const tens = Math.floor(n / 10);
    const units = n % 10;

    const tensText = tens === 0 ? '' : (tens === 1 ? '十' : `${CHINESE_NUMERALS[tens]}十`);
    const unitsText = units === 0 ? '' : CHINESE_NUMERALS[units];
    return `${tensText}${unitsText}`;
}

function getTaisuiYearName(date) {
    const year = date.getFullYear();
    return TAISUI_YEAR_NAME[year] || `${year}`;
}

function getLunarMonthDay(date) {
    const lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
        month: 'long',
        day: 'numeric'
    });

    const parts = lunarFormatter.formatToParts(date);
    const month = parts.find(part => part.type === 'month')?.value || '';
    const day = parts.find(part => part.type === 'day')?.value || '';

    return `${month}${toChineseDay(day)}`;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const taisuiYear = getTaisuiYearName(date);
    const lunarMonthDay = getLunarMonthDay(date);

    return `${taisuiYear}年${lunarMonthDay}／${year} 年 ${month} 月 ${day} 日 ${hours}:${minutes}:${seconds}`;
}

async function updateLastCommitTime() {
    const paragraph = document.getElementById('last-commit');
    try {
        const isoDate = await getLastCommitTime('scetayh', 'tarikkochan.github.io');
        if (!isoDate) {
            paragraph.textContent = '本頁最終更新　時日未詳';
            return;
        }
        const dateObj = new Date(isoDate);
        const formatted = formatDate(dateObj);
        paragraph.textContent = `本頁最終更新　${formatted}`;
    } catch (error) {
        paragraph.textContent = '本頁最終更新　時日未詳';
    }
}

loadPersistedState();
bindToolbarControls();
updateToolbarState();
renderDomainList();
updateLastCommitTime();
