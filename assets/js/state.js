const STORAGE_KEY = 'tarikkochan.domainState';

const domainState = {
    rawData: [],
    sortKey: 'original',
    sortDirection: 'asc',
    filterMode: 'all'
};

function loadPersistedState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
            if (parsed.sortKey) domainState.sortKey = parsed.sortKey;
            if (parsed.sortDirection) domainState.sortDirection = parsed.sortDirection;
            if (parsed.filterMode) domainState.filterMode = parsed.filterMode;
        }
    } catch (error) {
        console.warn('Failed to restore saved domain state:', error);
    }
}

function persistState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            sortKey: domainState.sortKey,
            sortDirection: domainState.sortDirection,
            filterMode: domainState.filterMode
        }));
    } catch (error) {
        console.warn('Failed to save domain state:', error);
    }
}

function normalizeString(value) {
    return String(value ?? '').trim().toLowerCase();
}

function getItemEnabled(item) {
    return item.enabled !== false;
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
