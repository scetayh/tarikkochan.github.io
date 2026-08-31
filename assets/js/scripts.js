const domainState = {
    rawData: [],
    sortKey: 'original',
    sortDirection: 'asc',
    filterMode: 'all'
};

function normalizeString(value) {
    return String(value ?? '').trim().toLowerCase();
}

function getItemEnabled(item) {
    return item.enabled !== false;
}

function getItemOriginalIndex(item, index) {
    return Object.prototype.hasOwnProperty.call(item, 'album') ? Number(item.index) || 0 : index + 1;
}

function getAlbumValue(item) {
    return item.album || '';
}

function getSortDirectionMultiplier(direction) {
    return direction === 'desc' ? -1 : 1;
}

function compareValues(a, b, direction) {
    const lhs = a ?? '';
    const rhs = b ?? '';
    if (lhs < rhs) return -1 * getSortDirectionMultiplier(direction);
    if (lhs > rhs) return 1 * getSortDirectionMultiplier(direction);
    return 0;
}

function getAlbumLocalSortValue(item) {
    if (Object.prototype.hasOwnProperty.call(item, 'album') && item.index !== undefined && item.index !== null && item.index !== '') {
        return Number(item.index) || 0;
    }
    return item.albumLocalOrder ?? (item.originalIndex ?? 0);
}

function getStableTrackIndex(item) {
    if (Object.prototype.hasOwnProperty.call(item, 'album') && item.index !== undefined && item.index !== null && item.index !== '') {
        return Number(item.index) || 0;
    }
    return item.albumLocalOrder ?? ((item.originalIndex ?? 0) + 1);
}

function compareDomainItems(a, b) {
    const direction = domainState.sortDirection;

    if (domainState.sortKey === 'original') {
        return compareValues(a.originalIndex, b.originalIndex, direction);
    }

    if (domainState.sortKey === 'title') {
        return compareValues(normalizeString(a.title || a.domain), normalizeString(b.title || b.domain), direction);
    }

    if (domainState.sortKey === 'subtitle') {
        return compareValues(normalizeString(a.subtitle || ''), normalizeString(b.subtitle || ''), direction);
    }

    if (domainState.sortKey === 'domain') {
        return compareValues(normalizeString(a.domain || ''), normalizeString(b.domain || ''), direction);
    }

    if (domainState.sortKey === 'album') {
        const albumA = normalizeString(getAlbumValue(a));
        const albumB = normalizeString(getAlbumValue(b));

        if (albumA !== albumB) {
            return compareValues(albumA, albumB, direction);
        }

        return compareValues(getAlbumLocalSortValue(a), getAlbumLocalSortValue(b), direction);
    }

    if (domainState.sortKey === 'enabled') {
        const enabledA = getItemEnabled(a);
        const enabledB = getItemEnabled(b);

        if (enabledA !== enabledB) {
            return enabledA ? -1 : 1;
        }

        return compareValues(a.originalIndex, b.originalIndex, direction === 'desc' ? 'desc' : 'asc');
    }

    return 0;
}

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
            renderDomainList();
        });
    });

    document.querySelectorAll('[data-direction]').forEach(button => {
        button.addEventListener('click', () => {
            domainState.sortDirection = button.dataset.direction;
            renderDomainList();
        });
    });

    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', () => {
            domainState.filterMode = button.dataset.filter;
            renderDomainList();
        });
    });
}

function getFilteredDomainData() {
    const albumCounters = new Map();

    return domainState.rawData
        .map((item, index) => {
            const albumKey = item.album || '幻想界域伝說　～ Gateway to the Wandering Tales.';
            const albumNeedsExplicitIndex = Object.prototype.hasOwnProperty.call(item, 'album') && item.index !== undefined && item.index !== null && item.index !== '';

            const currentAlbumCount = albumCounters.get(albumKey) ?? 0;
            const albumLocalOrder = albumNeedsExplicitIndex
                ? Number(item.index) || 0
                : currentAlbumCount + 1;

            albumCounters.set(albumKey, Math.max(currentAlbumCount, albumLocalOrder));

            return {
                ...item,
                originalIndex: index,
                albumLocalOrder
            };
        })
        .filter(item => {
            if (domainState.filterMode === 'enabled') {
                return getItemEnabled(item);
            }
            if (domainState.filterMode === 'disabled') {
                return !getItemEnabled(item);
            }
            return true;
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

        const group = document.createElement('div');
        group.className = 'album-group';
        if (allDisabled) {
            group.classList.add('is-dimmed');
        }

        const header = document.createElement('div');
        header.className = 'album-group-header';
        header.textContent = `『${albumName}』`;
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

bindToolbarControls();
renderDomainList();

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

function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year} 年 ${month} 月 ${day} 日 ${hours}:${minutes}:${seconds}`;
}

async function updateLastCommitTime() {
    const paragraph = document.getElementById('last-commit');
    try {
        const isoDate = await getLastCommitTime('scetayh', 'tarikkochan.github.io');
        if (!isoDate) {
            paragraph.textContent = '本页面最后更新于未知时间';
            return;
        }
        const dateObj = new Date(isoDate);
        const formatted = formatDate(dateObj);
        paragraph.textContent = `本页面最后更新于 ${formatted}`;
    } catch (error) {
        paragraph.textContent = '本页面最后更新于未知时间';
    }
}

updateLastCommitTime();
renderDomainList();