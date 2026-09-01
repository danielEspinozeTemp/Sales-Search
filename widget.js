const US_STATES = [
    { code: 'AL', name: 'Alabama', tz: 'America/Chicago' },
    { code: 'AK', name: 'Alaska', tz: 'America/Anchorage' },
    { code: 'AZ', name: 'Arizona', tz: 'America/Phoenix' },
    { code: 'AR', name: 'Arkansas', tz: 'America/Chicago' },
    { code: 'CA', name: 'California', tz: 'America/Los_Angeles' },
    { code: 'CO', name: 'Colorado', tz: 'America/Denver' },
    { code: 'CT', name: 'Connecticut', tz: 'America/New_York' },
    { code: 'DE', name: 'Delaware', tz: 'America/New_York' },
    { code: 'FL', name: 'Florida', tz: 'America/New_York' },
    { code: 'GA', name: 'Georgia', tz: 'America/New_York' },
    { code: 'HI', name: 'Hawaii', tz: 'Pacific/Honolulu' },
    { code: 'ID', name: 'Idaho', tz: 'America/Boise' },
    { code: 'IL', name: 'Illinois', tz: 'America/Chicago' },
    { code: 'IN', name: 'Indiana', tz: 'America/Indiana/Indianapolis' },
    { code: 'IA', name: 'Iowa', tz: 'America/Chicago' },
    { code: 'KS', name: 'Kansas', tz: 'America/Chicago' },
    { code: 'KY', name: 'Kentucky', tz: 'America/New_York' },
    { code: 'LA', name: 'Louisiana', tz: 'America/Chicago' },
    { code: 'ME', name: 'Maine', tz: 'America/New_York' },
    { code: 'MD', name: 'Maryland', tz: 'America/New_York' },
    { code: 'MA', name: 'Massachusetts', tz: 'America/New_York' },
    { code: 'MI', name: 'Michigan', tz: 'America/Detroit' },
    { code: 'MN', name: 'Minnesota', tz: 'America/Chicago' },
    { code: 'MS', name: 'Mississippi', tz: 'America/Chicago' },
    { code: 'MO', name: 'Missouri', tz: 'America/Chicago' },
    { code: 'MT', name: 'Montana', tz: 'America/Denver' },
    { code: 'NE', name: 'Nebraska', tz: 'America/Chicago' },
    { code: 'NV', name: 'Nevada', tz: 'America/Los_Angeles' },
    { code: 'NH', name: 'New Hampshire', tz: 'America/New_York' },
    { code: 'NJ', name: 'New Jersey', tz: 'America/New_York' },
    { code: 'NM', name: 'New Mexico', tz: 'America/Denver' },
    { code: 'NY', name: 'New York', tz: 'America/New_York' },
    { code: 'NC', name: 'North Carolina', tz: 'America/New_York' },
    { code: 'ND', name: 'North Dakota', tz: 'America/North_Dakota/Center' },
    { code: 'OH', name: 'Ohio', tz: 'America/New_York' },
    { code: 'OK', name: 'Oklahoma', tz: 'America/Chicago' },
    { code: 'OR', name: 'Oregon', tz: 'America/Los_Angeles' },
    { code: 'PA', name: 'Pennsylvania', tz: 'America/New_York' },
    { code: 'RI', name: 'Rhode Island', tz: 'America/New_York' },
    { code: 'SC', name: 'South Carolina', tz: 'America/New_York' },
    { code: 'SD', name: 'South Dakota', tz: 'America/Chicago' },
    { code: 'TN', name: 'Tennessee', tz: 'America/Chicago' },
    { code: 'TX', name: 'Texas', tz: 'America/Chicago' },
    { code: 'UT', name: 'Utah', tz: 'America/Denver' },
    { code: 'VT', name: 'Vermont', tz: 'America/New_York' },
    { code: 'VA', name: 'Virginia', tz: 'America/New_York' },
    { code: 'WA', name: 'Washington', tz: 'America/Los_Angeles' },
    { code: 'WV', name: 'West Virginia', tz: 'America/New_York' },
    { code: 'WI', name: 'Wisconsin', tz: 'America/Chicago' },
    { code: 'WY', name: 'Wyoming', tz: 'America/Denver' }
];

let cachedYear = null;
let startOfYear = 0;
let endOfYear = 0;
let stateTimeElements = [];

function initWidgetDOM() {
    const container = document.getElementById('stateTimeList');
    if (!container) return;
    
    container.innerHTML = '';
    stateTimeElements = US_STATES.map(s => {
        const item = document.createElement('div');
        item.className = 'state-time-item';
        item.dataset.code = s.code;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'state-time-name';
        nameSpan.textContent = `${s.name} (${s.code})`;

        const valSpan = document.createElement('span');
        valSpan.className = 'state-time-val';

        item.appendChild(nameSpan);
        item.appendChild(valSpan);
        container.appendChild(item);

        return { code: s.code, tz: s.tz, valSpan, item };
    });
}

function updateClocks() {
    const now = new Date();
    document.getElementById('localClock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('localDate').textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    updateYearProgress(now);

    const stateSelect = document.getElementById('state');
    const selectedState = stateSelect ? stateSelect.value : '';

    stateTimeElements.forEach(obj => {
        obj.valSpan.textContent = now.toLocaleTimeString('en-US', { timeZone: obj.tz, hour: '2-digit', minute: '2-digit', hour12: true });
        if (obj.code === selectedState) {
            obj.item.style.fontWeight = '700';
            obj.item.style.color = 'var(--accent-color)';
        } else {
            obj.item.style.fontWeight = '';
            obj.item.style.color = '';
        }
    });
}

function updateYearProgress(now) {
    const year = now.getFullYear();
    if (year !== cachedYear) {
        cachedYear = year;
        startOfYear = new Date(year, 0, 1).getTime();
        endOfYear = new Date(year + 1, 0, 1).getTime();
        document.getElementById('yearLabel').textContent = `${year} Progress`;
    }
    const pct = ((now.getTime() - startOfYear) / (endOfYear - startOfYear) * 100).toFixed(2) + '%';
    document.getElementById('yearPercent').textContent = pct;
    document.getElementById('yearFill').style.width = pct;
}

document.addEventListener('DOMContentLoaded', () => {
    initWidgetDOM();
    updateClocks();
    setInterval(updateClocks, 1000);
});
