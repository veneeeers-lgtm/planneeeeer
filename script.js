// ============================================
// МОЙ ИДЕАЛЬНЫЙ ДЕНЬ — ЛОГИКА
// ============================================

var data = {
    habits: [], history: {}, water: {}, moods: {}, sport: {}, sportGoal: '', food: {},
    rituals: {
        morning: [
            { id: 'm1', text: 'Ранний подъём' },
            { id: 'm2', text: 'Стакан воды' },
            { id: 'm3', text: 'Зарядка / растяжка' },
            { id: 'm4', text: 'Душ' },
            { id: 'm5', text: 'Завтрак' },
            { id: 'm6', text: 'План на день' }
        ],
        evening: [
            { id: 'e1', text: 'Убраться на столе' },
            { id: 'e2', text: 'Без телефона за час до сна' },
            { id: 'e3', text: 'Тёплый душ' },
            { id: 'e4', text: 'Книга / медитация' },
            { id: 'e5', text: 'Записать благодарности' },
            { id: 'e6', text: 'Ложиться вовремя' }
        ]
    },
    ritualDone: {}, goals: [], reward: '', notes: ''
};

var gdata = { xp: 0, level: 1, coins: 0, achievements: [], streakBonusDays: 0 };
var petState = { name: 'Мурзик', sleeping: false, collapsed: false, mood: 'normal', forceAwake: false };
var PET_MOODS = ['normal', 'happy', 'cool', 'love', 'music', 'crying'];

var XP_PER_LEVEL = 100, XP_HABIT = 10, XP_WATER = 3, XP_FOOD = 3, XP_SPORT = 8, XP_RITUAL = 4;
var XP_STREAK_BONUS = 30, COINS_HABIT = 5, COINS_BONUS = 20;

var ACHIEVEMENTS = [
    { id: 'first_habit',  icon: '🌱', title: 'Первый шаг',      desc: 'Создать первую привычку',       check: function() { return data.habits.length >= 1; } },
    { id: 'first_check',  icon: '✅', title: 'Начало положено', desc: 'Отметить привычку впервые',      check: function() { return totalHabitChecks() >= 1; } },
    { id: 'ten_checks',   icon: '🔟', title: 'Десятка',         desc: '10 отметок привычек',            check: function() { return totalHabitChecks() >= 10; } },
    { id: 'fifty_checks', icon: '💪', title: 'Полтинник',       desc: '50 отметок привычек',            check: function() { return totalHabitChecks() >= 50; } },
    { id: 'hundred',      icon: '💯', title: 'Сотка',           desc: '100 отметок привычек',           check: function() { return totalHabitChecks() >= 100; } },
    { id: 'streak7',      icon: '🔥', title: 'Неделя огня',     desc: 'Серия из 7 дней подряд',         check: function() { return getMaxStreak() >= 7; } },
    { id: 'streak30',     icon: '🚀', title: 'Месяц силы',      desc: 'Серия из 30 дней подряд',        check: function() { return getMaxStreak() >= 30; } },
    { id: 'level5',       icon: '⭐', title: 'Опытный',         desc: 'Достичь 5 уровня',               check: function() { return gdata.level >= 5; } },
    { id: 'level10',      icon: '👑', title: 'Мастер',          desc: 'Достичь 10 уровня',              check: function() { return gdata.level >= 10; } },
    { id: 'perfect_day',  icon: '🎯', title: 'Идеальный день',  desc: 'Выполнить все привычки за день', check: function() { return hasPerfectDay(); } },
    { id: 'water_full',   icon: '💧', title: 'Водохлёб',        desc: 'Выпить всю норму воды за день',  check: function() { return hasFullWaterDay(); } },
    { id: 'rich',         icon: '💰', title: 'Богач',           desc: 'Накопить 200 монет',             check: function() { return gdata.coins >= 200; } }
];

var WATER_GOAL = 6;
var WATER_SLOTS = ['08:00', '10:30', '13:00', '15:30', '18:00', '20:30'];
var SPORT_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

var FOOD_ITEMS = [
    { id: 'breakfast', text: 'Завтрак' },
    { id: 'lunch', text: 'Обед' },
    { id: 'dinner', text: 'Ужин' },
    { id: 'snack', text: 'Перекусы' },
    { id: 'veggies', text: 'Овощи и фрукты' },
    { id: 'water', text: 'Пить воду' },
    { id: 'sugar', text: 'Меньше сахара' }
];

var MOODS = [
    { value: 5, emoji: '😊', label: 'Отлично' },
    { value: 4, emoji: '🙂', label: 'Хорошо' },
    { value: 3, emoji: '😐', label: 'Нормально' },
    { value: 2, emoji: '😴', label: 'Устал' },
    { value: 1, emoji: '😔', label: 'Плохо' }
];

var ARTICLES = [
    { id: 'warmup', tag: 'спорт', title: 'Зачем нужна разминка', excerpt: '5 минут разминки снижают риск травмы почти вдвое.', full: '<p>Многие пропускают разминку, чтобы сэкономить время. Но именно она готовит мышцы, суставы и сердце к нагрузке.</p><p>Достаточно 5–7 минут:</p><ul><li>лёгкое кардио</li><li>круговые движения</li><li>наклоны и растяжка</li></ul><p>Разминка повышает температуру тела и снижает риск растяжений.</p>' },
    { id: 'water', tag: 'питание', title: 'Почему вода важнее, чем кажется', excerpt: 'Даже 2% обезвоживания снижают концентрацию.', full: '<p>Вода участвует во всех процессах организма.</p><p>Признаки нехватки:</p><ul><li>сухость кожи</li><li>головная боль</li><li>усталость</li></ul><p>Ориентир — 6–8 стаканов в день.</p>' },
    { id: '21days', tag: 'привычки', title: 'Правило 21 дня — миф?', excerpt: 'Привычка формируется от 18 до 254 дней.', full: '<p>Знаменитое «21 день» — упрощение. Средний срок — 66 дней.</p><p>Что важно:</p><ul><li>регулярность</li><li>привязка к ритуалу</li><li>маленькие шаги</li></ul>' },
    { id: 'sleep', tag: 'сон', title: 'Что делать за час до сна', excerpt: 'Тёплый свет, никакого телефона.', full: '<p>Качество сна определяет энергию на следующий день.</p><ul><li>приглушите свет</li><li>уберите телефон</li><li>почитайте</li><li>запишите благодарности</li></ul>' },
    { id: 'cardio', tag: 'спорт', title: 'Кардио для начинающих', excerpt: '20–30 минут в день достаточно.', full: '<p>Кардио тренирует сердце и выносливость.</p><ul><li>ходьба 30 минут</li><li>бег 15–20 минут</li><li>велосипед</li><li>танцы</li></ul>' },
    { id: 'stretch', tag: 'спорт', title: 'Растяжка после тренировки', excerpt: '10 минут растяжки уменьшают боль.', full: '<p>Растяжка помогает мышцам восстановиться.</p><p>Что растягивать: ноги, спину, плечи, грудь.</p>' },
    { id: 'protein', tag: 'питание', title: 'Сколько белка нужно в день', excerpt: 'Примерно 1,2–1,6 г на кг веса.', full: '<p>Белок — строительный материал для мышц.</p><ul><li>курица, рыба</li><li>яйца, творог</li><li>бобовые</li></ul>' },
    { id: 'morning', tag: 'привычки', title: 'Как не проспать утром', excerpt: 'Ложитесь и вставайте в одно время.', full: '<p>Утренний подъём зависит от режима.</p><ul><li>ложиться в одно время</li><li>телефон вне спальни</li><li>стакан воды сразу</li></ul>' },
    { id: 'focus', tag: 'привычки', title: 'Как сохранять фокус', excerpt: 'Метод «25 минут работы — 5 отдыха».', full: '<p>Мозгу сложно долго концентрироваться.</p><p>Помодоро: 25 минут работа → 5 отдых → 4 цикла.</p>' },
    { id: 'breathing', tag: 'йога', title: 'Дыхание 4-7-8', excerpt: 'Помогает быстро уснуть за 2 минуты.', full: '<p>Вдох — 4 сек, задержка — 7, выдох — 8. Повторить 4 раза.</p>' },
    { id: 'meditation', tag: 'ментальное', title: 'Медитация для начинающих', excerpt: '5 минут в день достаточно.', full: '<p>Медитация — умение замечать мысли без осуждения.</p><p>5 минут в день дают эффект через 2 недели.</p>' },
    { id: 'gratitude', tag: 'ментальное', title: 'Практика благодарности', excerpt: 'Три благодарности в день повышают счастье.', full: '<p>Каждый вечер записывайте 3 вещи — конкретно, а не обобщённо.</p>' },
    { id: 'walk', tag: 'спорт', title: 'Польза ежедневных прогулок', excerpt: '30 минут ходьбы в день укрепляют сердце.', full: '<p>Ходьба — самое доступное кардио.</p><ul><li>укрепляет сердце</li><li>улучшает настроение</li><li>снижает стресс</li></ul>' },
    { id: 'tea', tag: 'питание', title: 'Травяные чаи', excerpt: 'Ромашка — для сна, мята — для пищеварения.', full: '<p>Мягкий способ поддержать организм.</p><ul><li>ромашка — перед сном</li><li>мята — после еды</li><li>имбирь — при простуде</li></ul>' },
    { id: 'screen-eyes', tag: 'здоровье', title: 'Зарядка для глаз', excerpt: 'Правило 20-20-20 спасает зрение.', full: '<p>Каждые 20 минут смотреть 20 секунд на объект в 6 метрах.</p>' },
    { id: 'self-compassion', tag: 'ментальное', title: 'Доброта к себе', excerpt: 'Говорите с собой как с другом.', full: '<p>Замените внутреннего критика на поддержку. Ошибки — часть пути.</p>' }
];

// ---------- ВСПОМОГАТЕЛЬНОЕ ----------
function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}
function formatDate(iso) { return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); }
function formatDateShort(iso) { return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }); }

// ---------- КРАСИВОЕ ОКНО ПОДТВЕРЖДЕНИЯ ----------
function customConfirm(message, title = 'Подтвердите действие') {
    return new Promise((resolve) => {
        const modal = document.getElementById('customConfirmModal');
        if (!modal) {
            // Если вдруг HTML не обновлен, используем старый способ
            resolve(confirm(message));
            return;
        }
        
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        modal.classList.add('show');

        const btnOk = document.getElementById('confirmOk');
        const btnCancel = document.getElementById('confirmCancel');

        const cleanup = () => {
            modal.classList.remove('show');
            btnOk.removeEventListener('click', onOk);
            btnCancel.removeEventListener('click', onCancel);
        };

        const onOk = () => { cleanup(); resolve(true); };
        const onCancel = () => { cleanup(); resolve(false); };

        btnOk.addEventListener('click', onOk);
        btnCancel.addEventListener('click', onCancel);
    });
}

// ---------- СОХРАНЕНИЕ ----------
function load() {
    var s = localStorage.getItem('planner');
    if (s) { try { var p = JSON.parse(s); Object.keys(p).forEach(function(k){ data[k]=p[k]; }); } catch(e){} }
    var g = localStorage.getItem('gamification');
    if (g) { try { var pg = JSON.parse(g); Object.keys(pg).forEach(function(k){ gdata[k]=pg[k]; }); } catch(e){} }
    var p2 = localStorage.getItem('pet');
    if (p2) { try { var pp = JSON.parse(p2); Object.keys(pp).forEach(function(k){ petState[k]=pp[k]; }); } catch(e){} }
}
function save() { localStorage.setItem('planner', JSON.stringify(data)); }
function saveG() { localStorage.setItem('gamification', JSON.stringify(gdata)); }
function savePet() { localStorage.setItem('pet', JSON.stringify(petState)); }

// ---------- ГЕЙМИФИКАЦИЯ ----------
function xpInLevel() { return gdata.xp % XP_PER_LEVEL; }
function recalcLevel() { gdata.level = Math.floor(gdata.xp / XP_PER_LEVEL) + 1; }

function awardXP(amount, coins) {
    if (amount) gdata.xp += amount;
    if (coins) gdata.coins += coins;
    recalcLevel(); saveG(); renderUserCard(); checkAchievements();
}
function removeXP(amount, coins) {
    gdata.xp = Math.max(0, gdata.xp - (amount || 0));
    gdata.coins = Math.max(0, gdata.coins - (coins || 0));
    recalcLevel(); saveG(); renderUserCard();
}
function totalHabitChecks() {
    var total = 0;
    Object.keys(data.history).forEach(function(d) { total += (data.history[d]||[]).length; });
    return total;
}
function getMaxStreak() {
    var dates = Object.keys(data.history).sort();
    var maxStreak = 0, current = 0, prev = null;
    dates.forEach(function(d) {
        if (!data.history[d] || data.history[d].length === 0) { current = 0; prev = null; return; }
        if (prev) {
            var diff = (new Date(d) - new Date(prev)) / 86400000;
            current = (diff === 1) ? current + 1 : 1;
        } else current = 1;
        if (current > maxStreak) maxStreak = current;
        prev = d;
    });
    return maxStreak;
}
function hasPerfectDay() {
    if (data.habits.length === 0) return false;
    return Object.keys(data.history).some(function(d) {
        return (data.history[d] || []).length >= data.habits.length;
    });
}
function hasFullWaterDay() {
    return Object.keys(data.water || {}).some(function(d) {
        return data.water[d] && data.water[d].count >= WATER_GOAL;
    });
}

function checkAchievements() {
    var newlyUnlocked = [];
    ACHIEVEMENTS.forEach(function(a) {
        if (gdata.achievements.indexOf(a.id) !== -1) return;
        try { if (a.check()) { gdata.achievements.push(a.id); newlyUnlocked.push(a); } } catch(e){}
    });
    if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach(function(a) { gdata.xp += 25; gdata.coins += 15; });
        recalcLevel(); saveG(); renderUserCard(); renderAchievements();

        spawnFlowers(newlyUnlocked[0]);

        newlyUnlocked.forEach(function(a, i) {
            if (i === 0) return;
            setTimeout(function() {
                showToast(a.icon + ' Достижение: ' + a.title + ' (+25 XP, +15 🪙)', true);
            }, i * 600 + 2500);
        });
    }
}

function renderUserCard() {
    var lv = document.getElementById('levelValue');
    var co = document.getElementById('coinsValue');
    var xp = document.getElementById('xpValue');
    var fill = document.getElementById('xpFill');
    if (lv) lv.textContent = gdata.level;
    if (co) co.textContent = gdata.coins;
    if (xp) xp.textContent = xpInLevel();
    if (fill) fill.style.width = (xpInLevel() / XP_PER_LEVEL * 100) + '%';
    renderPet();
}

function renderAchievements() {
    var grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = ACHIEVEMENTS.map(function(a) {
        var unlocked = gdata.achievements.indexOf(a.id) !== -1;
        return '<div class="achievement-card ' + (unlocked ? 'unlocked' : '') + '">' +
            '<div class="achievement-icon">' + a.icon + '</div>' +
            '<div><div class="achievement-title">' + a.title + '</div>' +
            '<div class="achievement-desc">' + a.desc + '</div></div></div>';
    }).join('');
    var cnt = document.getElementById('achCount');
    var tot = document.getElementById('achTotal');
    if (cnt) cnt.textContent = gdata.achievements.length;
    if (tot) tot.textContent = ACHIEVEMENTS.length;
}

function showToast(text, gold) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast' + (gold ? ' gold' : '');
    el.textContent = text;
    container.appendChild(el);
    setTimeout(function() { el.remove(); }, 3000);
}

// ============================================
// 🌹 ЦВЕТОЧНЫЙ САЛЮТ + НАДПИСЬ ДОСТИЖЕНИЯ
// ============================================
var FLOWER_EMOJIS = ['🌹', '🌺', '🌸', '🥀', '🌷', '💐', '🏵️', '💮'];

function spawnFlowers(achievement) {
    var overlay = document.getElementById('bloomOverlay');
    if (!overlay) return;
    overlay.innerHTML = '';
    overlay.classList.add('show');

    if (achievement) {
        var popup = document.createElement('div');
        popup.className = 'ach-popup';
        popup.innerHTML =
            '<div class="ach-popup-label">Достижение разблокировано</div>' +
            '<div class="ach-popup-icon">' + achievement.icon + '</div>' +
            '<div class="ach-popup-title">' + achievement.title + '</div>' +
            '<div class="ach-popup-desc">' + achievement.desc + '</div>' +
            '<div class="ach-popup-reward">+25 XP &nbsp; · &nbsp; +15 🪙</div>';
        overlay.appendChild(popup);
    }

    var count = 24;
    for (var i = 0; i < count; i++) {
        (function(index) {
            setTimeout(function() {
                var flower = document.createElement('div');
                flower.className = 'bloom-flower';
                flower.textContent = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];
                flower.style.left = (Math.random() * 95) + '%';
                flower.style.fontSize = (2 + Math.random() * 2.2) + 'rem';
                flower.style.animationDelay = (Math.random() * 0.5) + 's';
                flower.style.animationDuration = (2.4 + Math.random() * 1.6) + 's';
                overlay.appendChild(flower);
                setTimeout(function() { flower.remove(); }, 4500);
            }, index * 80);
        })(i);
    }

    setTimeout(function() {
        overlay.classList.remove('show');
        setTimeout(function() { if (!overlay.classList.contains('show')) overlay.innerHTML = ''; }, 700);
    }, 4200);
}

// ============================================
// 🐱 ПИТОМЕЦ
// ============================================
var PET_STATUS = {
    1: 'Ещё маленький котёнок 🍼',
    2: 'Растёт вместе с тобой 💗',
    3: 'Уже учится мурчать 🎵',
    4: 'Пушистый и счастливый ✨',
    5: 'Мудрый мастер-кот 🌟'
};

function getPetStage() {
    var lv = gdata.level;
    if (lv >= 10) return 5;
    if (lv >= 7) return 4;
    if (lv >= 5) return 3;
    if (lv >= 3) return 2;
    return 1;
}

function renderPet() {
    var stage = document.getElementById('petStage');
    var nameEl = document.getElementById('petName');
    var statusEl = document.getElementById('petStatus');
    var boxEl = document.getElementById('petBox');
    if (!stage || !boxEl) return;

    if (petState.collapsed) boxEl.classList.add('collapsed');
    else boxEl.classList.remove('collapsed');

    var oldZzz = stage.querySelectorAll('.pet-zzz');
    oldZzz.forEach(function(z) { z.remove(); });

    var s = getPetStage();
    stage.setAttribute('data-stage', s);

    var hour = new Date().getHours();
    var isNight = (hour >= 22 || hour < 7);
    var sleeping = petState.sleeping || (isNight && !petState.forceAwake);
    var mood = sleeping ? 'sleeping' : (petState.mood || 'normal');

    var drawKey = s + '_' + mood;
    if (stage.getAttribute('data-drawn') !== drawKey) {
        stage.innerHTML = drawCat(s, mood);
        stage.setAttribute('data-drawn', drawKey);
    }

    if (sleeping) stage.classList.add('sleeping');
    else stage.classList.remove('sleeping');

    if (nameEl) nameEl.textContent = '🐱 ' + petState.name;
    if (statusEl) {
        var statuses = {
            sleeping: 'Спит... 💤',
            normal:   PET_STATUS[s] || 'Растёт вместе с тобой',
            happy:    'Рад и улыбается 😄',
            cool:     'Крутой котик 😎',
            love:     'Обнимашки! 💗',
            music:    'Слушает музыку 🎧',
            crying:   'Немного грустит 😢'
        };
        statusEl.textContent = statuses[mood] || 'Растёт вместе с тобой';
    }
}

function togglePetSleep() {
    var hour = new Date().getHours();
    var isNight = (hour >= 22 || hour < 7);
    var sleeping = petState.sleeping || (isNight && !petState.forceAwake);
    
    if (sleeping) {
        petState.sleeping = false;
        petState.forceAwake = true;
    } else {
        petState.sleeping = true;
        petState.forceAwake = false;
    }
    savePet();
    renderPet();
}

function cyclePetMood() {
    var hour = new Date().getHours();
    var isNight = (hour >= 22 || hour < 7);
    var sleeping = petState.sleeping || (isNight && !petState.forceAwake);

    if (sleeping) {
        petState.sleeping = false;
        petState.forceAwake = true;
    }

    var i = PET_MOODS.indexOf(petState.mood);
    i = (i + 1) % PET_MOODS.length;
    petState.mood = PET_MOODS[i];
    
    savePet();
    renderPet();
}

function togglePetCollapse() {
    petState.collapsed = !petState.collapsed;
    savePet();
    renderPet();
}

function renamePet() {
    var newName = prompt('Как назовём котика?', petState.name);
    if (newName && newName.trim()) {
        petState.name = newName.trim().slice(0, 20);
        savePet();
        renderPet();
        showToast('🐱 Теперь его зовут ' + petState.name + '!');
    }
}

function drawCat(stage, mood) {
    if (!mood) mood = 'normal';
    var outline = '#4a3a44'; 
    var fur = '#ffffff';
    var blush = '#ffb6c1';
    var grey = '#e0e0e0';

    var body = 
        '<path d="M 30 75 Q 10 110 50 105 Q 90 110 70 75 Z" fill="' + fur + '" stroke="' + outline + '" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<path d="M 34 100 Q 40 100 40 96" fill="none" stroke="' + outline + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M 66 100 Q 60 100 60 96" fill="none" stroke="' + outline + '" stroke-width="3" stroke-linecap="round"/>';

    var ears =
        '<path d="M 20 30 L 8 -5 L 44 18 Z" fill="' + fur + '" stroke="' + outline + '" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<path d="M 80 30 L 92 -5 L 56 18 Z" fill="' + fur + '" stroke="' + outline + '" stroke-width="3.5" stroke-linejoin="round"/>';

    var head = '<circle cx="50" cy="50" r="38" fill="' + fur + '" stroke="' + outline + '" stroke-width="3.5"/>';

    var stripes =
        '<line x1="41" y1="22" x2="41" y2="36" stroke="' + grey + '" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="50" y1="18" x2="50" y2="36" stroke="' + grey + '" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="59" y1="22" x2="59" y2="36" stroke="' + grey + '" stroke-width="4" stroke-linecap="round"/>';

    var blushSvg =
        '<ellipse cx="20" cy="62" rx="7" ry="4.5" fill="' + blush + '" opacity="0.8"/>' +
        '<ellipse cx="80" cy="62" rx="7" ry="4.5" fill="' + blush + '" opacity="0.8"/>';

    var whiskers =
        '<line x1="12" y1="56" x2="0" y2="52" stroke="' + outline + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="12" y1="64" x2="0" y2="68" stroke="' + outline + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="88" y1="56" x2="100" y2="52" stroke="' + outline + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="88" y1="64" x2="100" y2="68" stroke="' + outline + '" stroke-width="2.5" stroke-linecap="round"/>';

    var eyes = '', mouth = '', extra = '';

    if (mood === 'sleeping') {
        eyes =
            '<path d="M 28 50 Q 36 42 44 50" stroke="' + outline + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
            '<path d="M 56 50 Q 64 42 72 50" stroke="' + outline + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
        mouth = '<ellipse cx="50" cy="64" rx="3.5" ry="3.5" fill="' + outline + '"/>';
    } else if (mood === 'happy') {
        eyes =
            '<path d="M 28 50 Q 36 38 44 50" stroke="' + outline + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
            '<path d="M 56 50 Q 64 38 72 50" stroke="' + outline + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
        mouth =
            '<path d="M 36 58 Q 50 80 64 58 Z" fill="#ff8aa8" stroke="' + outline + '" stroke-width="3" stroke-linejoin="round"/>';
    } else if (mood === 'cool') {
        eyes = '';
        mouth = '<path d="M 40 66 Q 50 72 60 66" stroke="' + outline + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
        extra =
            '<g>' +
                '<path d="M 12 46 L 88 46 L 84 58 Q 50 66 16 58 Z" fill="#1a1a1a" stroke="' + outline + '" stroke-width="3" stroke-linejoin="round"/>' +
                '<line x1="4" y1="48" x2="12" y2="48" stroke="' + outline + '" stroke-width="3" stroke-linecap="round"/>' +
                '<line x1="88" y1="48" x2="96" y2="48" stroke="' + outline + '" stroke-width="3" stroke-linecap="round"/>' +
                '<path d="M 24 50 L 38 50" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>' +
            '</g>';
    } else if (mood === 'love') {
        eyes =
            '<path d="M 34 48 C 30 42 20 45 24 52 L 34 60 L 44 52 C 48 45 38 42 34 48 Z" fill="#ff4d4d" stroke="' + outline + '" stroke-width="2"/>' +
            '<path d="M 66 48 C 62 42 52 45 56 52 L 66 60 L 76 52 C 80 45 70 42 66 48 Z" fill="#ff4d4d" stroke="' + outline + '" stroke-width="2"/>';
        mouth =
            '<path d="M 44 66 Q 50 72 56 66" stroke="' + outline + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
        extra = 
            '<path d="M 50 -10 C 46 -18 34 -16 34 -8 C 34 0 50 10 50 10 C 50 10 66 0 66 -8 C 66 -16 54 -18 50 -10 Z" fill="#ff8aa8" stroke="' + outline + '" stroke-width="2.5" stroke-linejoin="round"/>';
    } else if (mood === 'music') {
        eyes =
            '<line x1="28" y1="50" x2="42" y2="50" stroke="' + outline + '" stroke-width="3.5" stroke-linecap="round"/>' +
            '<line x1="58" y1="50" x2="72" y2="50" stroke="' + outline + '" stroke-width="3.5" stroke-linecap="round"/>';
        mouth = '<path d="M 46 66 Q 50 70 54 66" stroke="' + outline + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
        extra =
            '<path d="M 14 44 Q 50 0 86 44" stroke="' + outline + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
            '<circle cx="14" cy="54" r="11" fill="#1a1a1a"/>' +
            '<circle cx="86" cy="54" r="11" fill="#1a1a1a"/>' +
            '<text x="-5" y="32" font-size="18" fill="' + outline + '" font-weight="bold">♪</text>' +
            '<text x="88" y="22" font-size="16" fill="' + outline + '" font-weight="bold">♫</text>';
    } else if (mood === 'crying') {
        eyes =
            '<ellipse cx="34" cy="50" rx="8" ry="11" fill="' + outline + '"/>' +
            '<ellipse cx="66" cy="50" rx="8" ry="11" fill="' + outline + '"/>' +
            '<circle cx="31" cy="46" r="3" fill="#fff"/>' +
            '<circle cx="63" cy="46" r="3" fill="#fff"/>' +
            '<circle cx="36" cy="54" r="1.5" fill="#fff"/>' +
            '<circle cx="68" cy="54" r="1.5" fill="#fff"/>';
        mouth = '<path d="M 42 68 Q 50 60 58 68" stroke="' + outline + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
        extra =
            '<ellipse cx="26" cy="66" rx="3.5" ry="6" fill="#8ac4e8" stroke="' + outline + '" stroke-width="1.5"/>' +
            '<ellipse cx="74" cy="66" rx="3.5" ry="6" fill="#8ac4e8" stroke="' + outline + '" stroke-width="1.5"/>';
    } else {
        eyes =
            '<ellipse cx="34" cy="50" rx="9" ry="12" fill="' + outline + '"/>' +
            '<ellipse cx="66" cy="50" rx="9" ry="12" fill="' + outline + '"/>' +
            '<circle cx="31" cy="46" r="3.5" fill="#fff"/>' +
            '<circle cx="63" cy="46" r="3.5" fill="#fff"/>' +
            '<circle cx="37" cy="54" r="1.5" fill="#fff"/>' +
            '<circle cx="69" cy="54" r="1.5" fill="#fff"/>';
        mouth =
            '<path d="M 45 62 Q 50 67 55 62" stroke="' + outline + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
            '<path d="M 50 64 L 50 67" stroke="' + outline + '" stroke-width="2.5" stroke-linecap="round"/>';
    }

    var bow = '';
    if (stage >= 2) {
        bow = '<g transform="translate(74,18)">' +
            '<ellipse cx="-5" cy="0" rx="7" ry="5" fill="#ff8aa8" stroke="' + outline + '" stroke-width="2.5"/>' +
            '<ellipse cx="5" cy="0" rx="7" ry="5" fill="#ff8aa8" stroke="' + outline + '" stroke-width="2.5"/>' +
            '<circle cx="0" cy="0" r="3" fill="#e8446a" stroke="' + outline + '" stroke-width="2"/></g>';
    }

    return '<svg viewBox="-15 -20 130 130" xmlns="http://www.w3.org/2000/svg">' +
        body + ears + head + stripes + blushSvg + whiskers + eyes + mouth + bow + extra +
    '</svg>';
}

// ---------- ПРИВЫЧКИ ----------
function addHabit(name, desc, cat) {
    data.habits.push({ id: uid(), name: name.trim(), description: desc.trim() || '', category: cat });
    save(); renderHabits(); renderHome(); checkAchievements();
}

async function deleteHabit(id) {
    if (!(await customConfirm('Удалить эту привычку?', 'Удаление привычки'))) return;
    data.habits = data.habits.filter(function(h) { return h.id !== id; });
    Object.keys(data.history).forEach(function(d) {
        data.history[d] = data.history[d].filter(function(hid) { return hid !== id; });
    });
    save(); renderHabits(); renderHome();
}

function toggleHabit(id) {
    var t = today();
    if (!data.history[t]) data.history[t] = [];
    var idx = data.history[t].indexOf(id);
    var wasDone = idx !== -1;
    if (!wasDone) {
        data.history[t].push(id);
        awardXP(XP_HABIT, COINS_HABIT);
        var streak = calcStreak();
        if (streak > 0 && streak % 7 === 0 && streak !== gdata.streakBonusDays) {
            gdata.streakBonusDays = streak;
            awardXP(XP_STREAK_BONUS, COINS_BONUS);
            showToast('🔥 Серия ' + streak + ' дней! +' + XP_STREAK_BONUS + ' XP, +' + COINS_BONUS + ' 🪙', true);
        }
        showToast('+' + XP_HABIT + ' XP, +' + COINS_HABIT + ' 🪙');
    } else {
        data.history[t].splice(idx, 1);
        removeXP(XP_HABIT, COINS_HABIT);
    }
    save(); renderHabits(); renderHome(); renderWeekChart();
}
function isHabitDone(id) {
    var t = today();
    return data.history[t] && data.history[t].indexOf(id) !== -1;
}

// ---------- ВОДА ----------
function getWater() {
    var t = today();
    if (!data.water[t]) data.water[t] = { count: 0, slots: WATER_SLOTS.map(function() { return false; }) };
    return data.water[t];
}
function setWaterCount(n) {
    var w = getWater();
    var oldCount = w.count;
    w.count = Math.max(0, Math.min(WATER_GOAL, n));
    var delta = w.count - oldCount;
    w.slots = WATER_SLOTS.map(function(_, i) { return i < w.count; });
    if (delta > 0) awardXP(XP_WATER * delta, delta);
    else if (delta < 0) removeXP(XP_WATER * -delta, -delta);
    save(); renderWater(); renderHome();
}
function toggleWaterSlot(i) {
    var w = getWater();
    var wasDone = w.slots[i];
    w.slots[i] = !w.slots[i];
    w.count = w.slots.filter(function(s) { return s; }).length;
    if (!wasDone) awardXP(XP_WATER, 1); else removeXP(XP_WATER, 1);
    save(); renderWater(); renderHome();
}

// ---------- СПОРТ ----------
function toggleSport(dateISO) {
    var wasDone = !!data.sport[dateISO];
    if (wasDone) { delete data.sport[dateISO]; removeXP(XP_SPORT, 3); }
    else { data.sport[dateISO] = true; awardXP(XP_SPORT, 3); }
    save(); renderSport();
}
function renderSport() {
    var container = document.getElementById('sportWeek');
    if (!container) return;
    var now = new Date();
    var day = (now.getDay() + 6) % 7;
    var monday = new Date(now);
    monday.setDate(now.getDate() - day);
    var t = today();
    var html = '', count = 0;
    for (var i = 0; i < 7; i++) {
        var d = new Date(monday);
        d.setDate(monday.getDate() + i);
        var dateISO = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        var done = !!data.sport[dateISO];
        var isToday = dateISO === t;
        if (done) count++;
        html += '<div class="sport-day ' + (done ? 'done' : '') + (isToday ? ' today' : '') + '" data-date="' + dateISO + '">' +
            '<div class="day-label">' + SPORT_DAYS[i] + '</div><div class="check">✓</div></div>';
    }
    container.innerHTML = html;
    var countEl = document.getElementById('sportWeekCount');
    if (countEl) countEl.textContent = count + ' / 7';
    container.querySelectorAll('.sport-day').forEach(function(el) {
        el.addEventListener('click', function() { toggleSport(el.dataset.date); });
    });
    var goalInput = document.getElementById('sportGoal');
    if (goalInput && document.activeElement !== goalInput) goalInput.value = data.sportGoal || '';
}

// ---------- ПИТАНИЕ ----------
function toggleFood(itemId) {
    var t = today();
    if (!data.food[t]) data.food[t] = [];
    var idx = data.food[t].indexOf(itemId);
    var wasDone = idx !== -1;
    if (!wasDone) { data.food[t].push(itemId); awardXP(XP_FOOD, 1); }
    else { data.food[t].splice(idx, 1); removeXP(XP_FOOD, 1); }
    save(); renderFood(); renderHome();
}
function renderFood() {
    var container = document.getElementById('foodList');
    if (!container) return;
    var t = today();
    var doneList = data.food[t] || [];
    container.innerHTML = FOOD_ITEMS.map(function(item) {
        var done = doneList.indexOf(item.id) !== -1;
        return '<label class="food-item ' + (done ? 'done' : '') + '">' +
            '<input type="checkbox" ' + (done ? 'checked' : '') + ' data-id="' + item.id + '">' +
            '<span>' + item.text + '</span></label>';
    }).join('');
    var countEl = document.getElementById('foodCount');
    if (countEl) countEl.textContent = doneList.length + ' / ' + FOOD_ITEMS.length;
    container.querySelectorAll('input').forEach(function(cb) {
        cb.addEventListener('change', function() { toggleFood(cb.dataset.id); });
    });
}

// ---------- НАСТРОЕНИЕ ----------
function setMood(dateISO, value) {
    if (value === null) delete data.moods[dateISO];
    else data.moods[dateISO] = value;
    save(); renderCalendar(); renderMoodStats();
}

// ---------- РИТУАЛЫ ----------
function isRitualDone(id) {
    var t = today();
    return data.ritualDone[t] && data.ritualDone[t].indexOf(id) !== -1;
}
function toggleRitual(id) {
    var t = today();
    if (!data.ritualDone[t]) data.ritualDone[t] = [];
    var idx = data.ritualDone[t].indexOf(id);
    var wasDone = idx !== -1;
    if (!wasDone) { data.ritualDone[t].push(id); awardXP(XP_RITUAL, 2); }
    else { data.ritualDone[t].splice(idx, 1); removeXP(XP_RITUAL, 2); }
    save(); renderRituals();
}

// ---------- РЕНДЕР: ГЛАВНАЯ ----------
function renderHome() {
    var t = today();
    var dateEl = document.getElementById('todayDate');
    if (dateEl) dateEl.textContent = formatDate(t);
    var totalHabits = data.habits.length;
    var doneHabits = data.history[t] ? data.history[t].length : 0;
    var waterCount = getWater().count;
    var foodDone = (data.food[t] || []).length;
    var foodTotal = FOOD_ITEMS.length;
    var W_HABITS = 50, W_WATER = 25, W_FOOD = 25;
    if (totalHabits === 0) { W_HABITS = 0; W_WATER = 50; W_FOOD = 50; }
    var habitsPart = totalHabits > 0 ? (doneHabits / totalHabits) * W_HABITS : 0;
    var waterPart = (waterCount / WATER_GOAL) * W_WATER;
    var foodPart = (foodDone / foodTotal) * W_FOOD;
    var percent = Math.round(habitsPart + waterPart + foodPart);
    if (percent > 100) percent = 100;
    var bigEl = document.getElementById('todayPercentBig');
    if (bigEl) bigEl.textContent = percent + '%';
    var note = percent === 100 ? 'Идеальный день!' :
               percent >= 70 ? 'Отличный прогресс' :
               percent >= 40 ? 'Хорошее начало' :
               percent > 0 ? 'Продолжай' : 'Начни с малого';
    var noteEl = document.getElementById('todayNote');
    if (noteEl) noteEl.textContent = note;
    var breakdown = document.getElementById('todayBreakdown');
    if (breakdown) {
        breakdown.innerHTML = '<span>Привычки ' + Math.round(habitsPart) + '%</span>' +
            '<span>Вода ' + Math.round(waterPart) + '%</span>' +
            '<span>Питание ' + Math.round(foodPart) + '%</span>';
    }
    var hc = document.getElementById('homeHabitsCount');
    if (hc) hc.textContent = doneHabits + ' / ' + totalHabits;
    var wc = document.getElementById('homeWaterCount');
    if (wc) wc.textContent = waterCount + ' / ' + WATER_GOAL;
    var sk = document.getElementById('homeStreak');
    if (sk) sk.textContent = calcStreak();
    drawChart('homeChart', percent);
    var list = document.getElementById('homeHabitList');
    if (!list) return;
    var preview = data.habits.slice(0, 3);
    if (preview.length === 0) {
        list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-soft);font-size:0.85rem;">Добавьте первую привычку</div>';
        return;
    }
    list.innerHTML = preview.map(function(h) {
        var d2 = isHabitDone(h.id);
        return '<div class="item ' + (d2 ? 'done' : '') + '">' +
            '<input type="checkbox" ' + (d2 ? 'checked' : '') + ' data-id="' + h.id + '">' +
            '<div class="body"><div class="title ' + (d2 ? 'done' : '') + '">' + escapeHtml(h.name) + '</div>' +
            '<div class="meta">' + h.category + '</div></div></div>';
    }).join('');
    list.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
        cb.addEventListener('change', function() { toggleHabit(cb.dataset.id); });
    });
}

// ---------- РЕНДЕР: ПРИВЫЧКИ ----------
var habitSearchQuery = '';
var habitCategoryFilter = 'all';

function getCategories() {
    var cats = {};
    data.habits.forEach(function(h) { cats[h.category] = (cats[h.category] || 0) + 1; });
    return cats;
}
function renderFilterTags() {
    var box = document.getElementById('filterTags');
    if (!box) return;
    var cats = getCategories();
    var html = '<button class="filter-tag ' + (habitCategoryFilter === 'all' ? 'active' : '') + '" data-cat="all">Все</button>';
    Object.keys(cats).forEach(function(c) {
        html += '<button class="filter-tag ' + (habitCategoryFilter === c ? 'active' : '') + '" data-cat="' + c + '">' + c + ' (' + cats[c] + ')</button>';
    });
    box.innerHTML = html;
    box.querySelectorAll('.filter-tag').forEach(function(btn) {
        btn.addEventListener('click', function() {
            habitCategoryFilter = btn.dataset.cat;
            renderFilterTags(); renderHabits();
        });
    });
}
function filterHabits(list) {
    var q = habitSearchQuery.trim().toLowerCase();
    return list.filter(function(h) {
        if (habitCategoryFilter !== 'all' && h.category !== habitCategoryFilter) return false;
        if (q && h.name.toLowerCase().indexOf(q) === -1 &&
            (h.description || '').toLowerCase().indexOf(q) === -1) return false;
        return true;
    });
}
function renderHabits() {
    var list = document.getElementById('habitList');
    if (!list) return;
    renderFilterTags();
    var filtered = filterHabits(data.habits);
    if (data.habits.length === 0) {
        list.innerHTML = '<div style="padding:40px 20px;text-align:center;color:var(--text-soft);font-size:0.85rem;">Нет привычек. Добавьте первую!</div>';
        return;
    }
    if (filtered.length === 0) {
        list.innerHTML = '<div style="padding:40px 20px;text-align:center;color:var(--text-soft);font-size:0.85rem;">Ничего не найдено 🔍</div>';
        return;
    }
    list.innerHTML = filtered.map(function(h) {
        var d = isHabitDone(h.id);
        return '<div class="item ' + (d ? 'done' : '') + '">' +
            '<input type="checkbox" ' + (d ? 'checked' : '') + ' data-id="' + h.id + '">' +
            '<div class="body">' +
                '<div class="title ' + (d ? 'done' : '') + '">' + escapeHtml(h.name) + '</div>' +
                (h.description ? '<div class="meta">' + escapeHtml(h.description) + '</div>' : '') +
                '<span class="cat-badge">' + escapeHtml(h.category) + '</span>' +
            '</div>' +
            '<div class="actions"><button class="del" data-id="' + h.id + '">Уд.</button></div></div>';
    }).join('');
    list.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
        cb.addEventListener('change', function() { toggleHabit(cb.dataset.id); });
    });
    list.querySelectorAll('.del').forEach(function(btn) {
        btn.addEventListener('click', function() { deleteHabit(btn.dataset.id); });
    });
}

// ---------- РЕНДЕР: НЕДЕЛЬНАЯ ДИАГРАММА ----------
function renderWeekChart() {
    var total = data.habits.length;
    var now = new Date();
    var done = 0, totalSlots = 0, bestDay = null, bestCount = -1;
    for (var i = 0; i < 7; i++) {
        var d = new Date(now);
        d.setDate(d.getDate() - i);
        var key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        var c = data.history[key] ? data.history[key].length : 0;
        done += c; totalSlots += total;
        if (c > bestCount) { bestCount = c; bestDay = formatDateShort(key); }
    }
    var percent = totalSlots > 0 ? Math.round((done / totalSlots) * 100) : 0;
    var cE = document.getElementById('weekChartCenter'); if (cE) cE.textContent = percent + '%';
    var dE = document.getElementById('weekDone'); if (dE) dE.textContent = done;
    var tE = document.getElementById('weekTotal'); if (tE) tE.textContent = totalSlots;
    var bE = document.getElementById('weekBest'); if (bE) bE.textContent = bestCount > 0 ? bestDay : '—';
    drawChart('weekChart', percent);
}

// ---------- РЕНДЕР: ВОДА ----------
function renderWater() {
    var w = getWater();
    var cE = document.getElementById('waterCount'); if (cE) cE.textContent = w.count;
    var gT = document.getElementById('waterGoalTop'); if (gT) gT.textContent = WATER_GOAL;
    var gE = document.getElementById('waterGoal'); if (gE) gE.textContent = WATER_GOAL;
    var fE = document.getElementById('waterFill'); if (fE) fE.style.width = (w.count / WATER_GOAL * 100) + '%';
    var slots = document.getElementById('waterSlots');
    if (slots) {
        slots.innerHTML = WATER_SLOTS.map(function(time, i) {
            return '<div class="water-slot ' + (w.slots[i] ? 'done' : '') + '" data-idx="' + i + '">' +
                '<span class="time">' + time + '</span><span class="glass"></span></div>';
        }).join('');
        slots.querySelectorAll('.water-slot').forEach(function(el) {
            el.addEventListener('click', function() { toggleWaterSlot(parseInt(el.dataset.idx)); });
        });
    }
}

// ---------- РЕНДЕР: КАЛЕНДАРЬ ----------
var calMonth = new Date().getMonth();
var calYear = new Date().getFullYear();

function renderCalendar() {
    var grid = document.getElementById('calendarGrid');
    if (!grid) return;
    var months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    document.getElementById('monthTitle').textContent = months[calMonth] + ' ' + calYear;
    var firstDay = new Date(calYear, calMonth, 1);
    var startWeekday = (firstDay.getDay() + 6) % 7;
    var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    var html = '';
    for (var i = 0; i < startWeekday; i++) html += '<div class="day empty"></div>';
    var t = today();
    for (var d = 1; d <= daysInMonth; d++) {
        var dateISO = calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        var mood = data.moods[dateISO];
        var isToday = dateISO === t;
        var cls = 'day' + (isToday ? ' today' : '');
        var moodAttr = mood ? ' data-mood="' + mood + '"' : '';
        var dot = mood ? '<span class="mood-dot mood-' + mood + '"></span>' : '';
        html += '<div class="' + cls + '" data-date="' + dateISO + '"' + moodAttr + '>' + d + dot + '</div>';
    }
    grid.innerHTML = html;
    grid.querySelectorAll('.day:not(.empty)').forEach(function(el) {
        el.addEventListener('click', function() { openMoodModal(el.dataset.date); });
    });
}
function renderMoodStats() {
    var container = document.getElementById('moodStats');
    if (!container) return;
    var counts = { 5:0, 4:0, 3:0, 2:0, 1:0 };
    Object.keys(data.moods).forEach(function(dateISO) {
        var d = new Date(dateISO);
        if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
            counts[data.moods[dateISO]] = (counts[data.moods[dateISO]] || 0) + 1;
        }
    });
    container.innerHTML = MOODS.map(function(m) {
        return '<div class="mood-stat"><div class="count">' + counts[m.value] + '</div>' +
            '<div class="label">' + m.emoji + ' ' + m.label + '</div></div>';
    }).join('');
}

// ---------- РЕНДЕР: РИТУАЛЫ ----------
function renderRituals() {
    var mL = document.getElementById('morningList');
    var eL = document.getElementById('eveningList');
    if (!mL || !eL) return;
    mL.innerHTML = data.rituals.morning.map(function(r) {
        var d = isRitualDone(r.id);
        return '<label class="ritual-item ' + (d ? 'done' : '') + '">' +
            '<input type="checkbox" ' + (d ? 'checked' : '') + ' data-id="' + r.id + '"><span>' + r.text + '</span></label>';
    }).join('');
    eL.innerHTML = data.rituals.evening.map(function(r) {
        var d = isRitualDone(r.id);
        return '<label class="ritual-item ' + (d ? 'done' : '') + '">' +
            '<input type="checkbox" ' + (d ? 'checked' : '') + ' data-id="' + r.id + '"><span>' + r.text + '</span></label>';
    }).join('');
    mL.querySelectorAll('input').forEach(function(cb){ cb.addEventListener('change', function(){ toggleRitual(cb.dataset.id); }); });
    eL.querySelectorAll('input').forEach(function(cb){ cb.addEventListener('change', function(){ toggleRitual(cb.dataset.id); }); });
}

// ---------- РЕНДЕР: ЦЕЛИ ----------
function renderGoals() {
    var list = document.getElementById('goalsList');
    if (!list) return;
    if (data.goals.length === 0) {
        list.innerHTML = '<div style="color:var(--text-soft);font-size:0.8rem;padding:8px 0;">Пока нет целей</div>';
    } else {
        list.innerHTML = data.goals.map(function(g) {
            return '<div class="goal-item">' +
                '<input type="checkbox" ' + (g.done ? 'checked' : '') + ' data-id="' + g.id + '">' +
                '<span style="' + (g.done ? 'text-decoration:line-through;color:var(--text-soft);' : '') + '">' + escapeHtml(g.text) + '</span>' +
                '<button data-id="' + g.id + '">&times;</button></div>';
        }).join('');
        list.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
            cb.addEventListener('change', function() {
                var g = data.goals.find(function(x) { return x.id === cb.dataset.id; });
                if (g) { g.done = cb.checked; save(); renderGoals(); }
            });
        });
        list.querySelectorAll('button').forEach(function(btn) {
            btn.addEventListener('click', function() {
                data.goals = data.goals.filter(function(x) { return x.id !== btn.dataset.id; });
                save(); renderGoals();
            });
        });
    }
    var rE = document.getElementById('rewardInput');
    if (rE && document.activeElement !== rE) rE.value = data.reward || '';
    var nE = document.getElementById('notesInput');
    if (nE && document.activeElement !== nE) nE.value = data.notes || '';
}

// ---------- РЕНДЕР: СТАТЬИ ----------
function renderArticles() {
    var list = document.getElementById('articlesList');
    if (!list) return;
    var shuffled = shuffleByDate(ARTICLES.slice());
    list.innerHTML = shuffled.slice(0, 8).map(function(a) {
        return '<div class="article-card" data-id="' + a.id + '">' +
            '<span class="article-tag ' + a.tag + '">' + a.tag + '</span>' +
            '<div class="article-title">' + escapeHtml(a.title) + '</div>' +
            '<div class="article-excerpt">' + escapeHtml(a.excerpt) + '</div></div>';
    }).join('');
    list.querySelectorAll('.article-card').forEach(function(card) {
        card.addEventListener('click', function() { openArticleModal(card.dataset.id); });
    });
}
function shuffleByDate(arr) {
    var rand = mulberry32(dateSeed());
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(rand() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
}
function dateSeed() {
    var d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function mulberry32(a) {
    return function() {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        var t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
function openArticleModal(id) {
    var a = ARTICLES.find(function(x) { return x.id === id; });
    if (!a) return;
    var modal = document.getElementById('articleModal');
    var body = document.getElementById('articleBody');
    body.innerHTML = '<span class="article-tag ' + a.tag + '">' + a.tag + '</span>' +
        '<h2>' + escapeHtml(a.title) + '</h2>' + a.full;
    modal.classList.add('show');
}
function closeArticleModal() { document.getElementById('articleModal').classList.remove('show'); }

// ---------- СТРИК ----------
function calcStreak() {
    var streak = 0;
    var d = new Date();
    var isFirst = true;
    while (true) {
        var key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        var h = data.history[key];
        if (h && h.length > 0) { streak++; d.setDate(d.getDate() - 1); isFirst = false; }
        else {
            if (isFirst) {
                d.setDate(d.getDate() - 1); isFirst = false;
                var k2 = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
                var h2 = data.history[k2];
                if (h2 && h2.length > 0) continue;
            }
            break;
        }
    }
    return streak;
}

// ---------- ДИАГРАММА ----------
function drawChart(canvasId, percent) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 12;
    var start = -Math.PI / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(247, 200, 216, 0.3)';
    ctx.lineWidth = 12;
    ctx.stroke();
    var end = start + (percent / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = '#f7c8d8';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
}

// ---------- МОДАЛЬНЫЕ ОКНА ----------
function openHabitModal() {
    document.getElementById('habitModalTitle').textContent = 'Добавить привычку';
    document.getElementById('habitForm').reset();
    document.getElementById('habitModal').classList.add('show');
}
function closeHabitModal() { document.getElementById('habitModal').classList.remove('show'); }

var moodDate = null;
function openMoodModal(dateISO) {
    moodDate = dateISO;
    document.getElementById('moodModalTitle').textContent = formatDate(dateISO);
    var picker = document.getElementById('moodPicker');
    var current = data.moods[dateISO];
    picker.innerHTML = MOODS.map(function(m) {
        return '<div class="mood-option ' + (current === m.value ? 'selected' : '') + '" data-value="' + m.value + '">' +
            '<span class="emoji">' + m.emoji + '</span><span class="label">' + m.label + '</span></div>';
    }).join('');
    picker.querySelectorAll('.mood-option').forEach(function(el) {
        el.addEventListener('click', function() {
            var v = parseInt(el.dataset.value);
            if (data.moods[moodDate] === v) setMood(moodDate, null);
            else setMood(moodDate, v);
            document.getElementById('moodModal').classList.remove('show');
        });
    });
    document.getElementById('moodModal').classList.add('show');
}

// ---------- НАВИГАЦИЯ ----------
function setupNav() {
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var page = btn.dataset.page;
            document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
            var pageEl = document.getElementById('page-' + page);
            if (pageEl) pageEl.classList.add('active');
            if (page === 'habits') renderWeekChart();
            if (page === 'health') { renderWater(); renderSport(); renderFood(); }
            if (page === 'calendar') { renderCalendar(); renderMoodStats(); }
            if (page === 'rituals') renderRituals();
            if (page === 'goals') renderGoals();
            if (page === 'achievements') renderAchievements();
        });
    });
}

// ---------- ТЕМА ----------
function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch(e) {}
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}
function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
        document.body.classList.add('dark');
        var btn = document.getElementById('themeToggle');
        if (btn) btn.textContent = '☀️';
    } else {
        root.classList.remove('dark');
        document.body.classList.remove('dark');
        var btn2 = document.getElementById('themeToggle');
        if (btn2) btn2.textContent = '🌙';
    }
    try { localStorage.setItem('theme', theme); } catch(e) {}
}

// ---------- ЭКСПОРТ / ИМПОРТ / СБРОС ----------
function exportData() {
    var backup = { version: 1, exportedAt: new Date().toISOString(), planner: data, gamification: gdata, pet: petState };
    var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'habitquest-backup-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('💾 Данные сохранены в файл');
}

async function importData(file) {
    var reader = new FileReader();
    reader.onload = async function(e) {
        try {
            var parsed = JSON.parse(e.target.result);
            if (!parsed.planner && !parsed.gamification) { showToast('❌ Неверный формат файла'); return; }
            if (!(await customConfirm('Импорт заменит текущие данные. Продолжить?', 'Импорт данных'))) return;
            if (parsed.planner) {
                Object.keys(parsed.planner).forEach(function(k) { data[k] = parsed.planner[k]; });
                save();
            }
            if (parsed.gamification) {
                Object.keys(parsed.gamification).forEach(function(k) { gdata[k] = parsed.gamification[k]; });
                saveG();
            }
            if (parsed.pet) {
                Object.keys(parsed.pet).forEach(function(k) { petState[k] = parsed.pet[k]; });
                savePet();
            }
            renderAll();
            showToast('📥 Данные загружены');
        } catch (err) {
            showToast('❌ Ошибка чтения файла');
            console.error(err);
        }
    };
    reader.readAsText(file);
}

async function resetAll() {
    if (!(await customConfirm('Удалить ВСЕ данные? Это действие нельзя отменить.', 'Полный сброс'))) return;

    localStorage.removeItem('planner');
    localStorage.removeItem('gamification');
    localStorage.removeItem('pet');

    data = {
        habits: [], history: {}, water: {}, moods: {}, sport: {}, sportGoal: '', food: {},
        rituals: {
            morning: [
                { id: 'm1', text: 'Ранний подъём' },
                { id: 'm2', text: 'Стакан воды' },
                { id: 'm3', text: 'Зарядка / растяжка' },
                { id: 'm4', text: 'Душ' },
                { id: 'm5', text: 'Завтрак' },
                { id: 'm6', text: 'План на день' }
            ],
            evening: [
                { id: 'e1', text: 'Убраться на столе' },
                { id: 'e2', text: 'Без телефона за час до сна' },
                { id: 'e3', text: 'Тёплый душ' },
                { id: 'e4', text: 'Книга / медитация' },
                { id: 'e5', text: 'Записать благодарности' },
                { id: 'e6', text: 'Ложиться вовремя' }
            ]
        },
        ritualDone: {}, goals: [], reward: '', notes: ''
    };
    gdata = { xp: 0, level: 1, coins: 0, achievements: [], streakBonusDays: 0 };
    petState = { name: 'Мурзик', sleeping: false, collapsed: false, mood: 'normal', forceAwake: false };

    renderAll();
    showToast('🔄 Всё сброшено');
}

// ---------- ОБЩИЙ РЕНДЕР ----------
function renderAll() {
    renderUserCard();
    renderPet();
    renderHome();
    renderHabits();
    renderWater();
    renderSport();
    renderFood();
    renderCalendar();
    renderMoodStats();
    renderRituals();
    renderGoals();
    renderWeekChart();
    renderAchievements();
    renderArticles();
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------
document.addEventListener('DOMContentLoaded', function() {
    load();
    initTheme();

    var d = new Date();
    var dateBox = document.getElementById('sidebarDate');
    if (dateBox) dateBox.textContent = d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

    setupNav();

    if (gdata.xp === 0 && gdata.achievements.length === 0) {
        setTimeout(function() { showToast('🎮 Добро пожаловать! Отмечай привычки и получай XP.'); }, 800);
    }

    document.getElementById('openAddHabit').addEventListener('click', openHabitModal);
    document.getElementById('closeHabitModal').addEventListener('click', closeHabitModal);
    document.getElementById('habitModal').addEventListener('click', function(e) {
        if (e.target === e.currentTarget) closeHabitModal();
    });
    document.getElementById('habitForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var name = document.getElementById('habitName').value;
        var desc = document.getElementById('habitDesc').value;
        var cat = document.getElementById('habitCategory').value;
        if (!name.trim()) return;
        addHabit(name, desc, cat);
        closeHabitModal();
    });

    document.getElementById('waterPlus').addEventListener('click', function() { setWaterCount(getWater().count + 1); });
    document.getElementById('waterMinus').addEventListener('click', function() { setWaterCount(getWater().count - 1); });

    var sg = document.getElementById('sportGoal');
    if (sg) sg.addEventListener('input', function(e) { data.sportGoal = e.target.value; save(); });

    document.getElementById('prevMonth').addEventListener('click', function() {
        calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
        renderCalendar(); renderMoodStats();
    });
    document.getElementById('nextMonth').addEventListener('click', function() {
        calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
        renderCalendar(); renderMoodStats();
    });
    document.getElementById('closeMoodModal').addEventListener('click', function() {
        document.getElementById('moodModal').classList.remove('show');
    });
    document.getElementById('moodModal').addEventListener('click', function(e) {
        if (e.target === e.currentTarget) document.getElementById('moodModal').classList.remove('show');
    });

    document.getElementById('closeArticleModal').addEventListener('click', closeArticleModal);
    document.getElementById('articleModal').addEventListener('click', function(e) {
        if (e.target === e.currentTarget) closeArticleModal();
    });

    document.getElementById('addGoal').addEventListener('click', function() {
        var inp = document.getElementById('goalInput');
        if (!inp.value.trim()) return;
        data.goals.push({ id: uid(), text: inp.value.trim(), done: false });
        inp.value = ''; save(); renderGoals();
    });
    document.getElementById('goalInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); document.getElementById('addGoal').click(); }
    });
    document.getElementById('rewardInput').addEventListener('input', function(e) { data.reward = e.target.value; save(); });
    document.getElementById('notesInput').addEventListener('input', function(e) { data.notes = e.target.value; save(); });

    document.querySelectorAll('[data-goto]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var target = btn.dataset.goto;
            var navBtn = document.querySelector('.nav-btn[data-page="' + target + '"]');
            if (navBtn) navBtn.click();
        });
    });

    // Тема
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', function() {
        var isDark = document.documentElement.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    // Экспорт / импорт / сброс
    var expBtn = document.getElementById('exportBtn');
    if (expBtn) expBtn.addEventListener('click', exportData);

    var impBtn = document.getElementById('importBtn');
    var impFile = document.getElementById('importFile');
    if (impBtn && impFile) {
        impBtn.addEventListener('click', function() { impFile.click(); });
        impFile.addEventListener('change', function(e) {
            if (e.target.files[0]) { importData(e.target.files[0]); e.target.value = ''; }
        });
    }

    var resBtn = document.getElementById('resetBtn');
    if (resBtn) resBtn.addEventListener('click', resetAll);

    // Поиск
    var searchInput = document.getElementById('habitSearch');
    if (searchInput) searchInput.addEventListener('input', function(e) {
        habitSearchQuery = e.target.value;
        renderHabits();
    });

    // Питомец
    var petStage = document.getElementById('petStage');
    if (petStage) {
        petStage.style.cursor = 'pointer';
        petStage.addEventListener('click', function(e) {
            e.stopPropagation();
            cyclePetMood();
        });
    }

    var petSleepBtn = document.getElementById('petSleep');
    if (petSleepBtn) {
        petSleepBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePetSleep();
        });
    }

    var petEdit = document.getElementById('petEdit');
    if (petEdit) {
        petEdit.addEventListener('click', function(e) {
            e.stopPropagation();
            renamePet();
        });
    }

    var petToggle = document.getElementById('petToggle');
    if (petToggle) {
        petToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePetCollapse();
        });
    }

    var petHeader = document.getElementById('petHeader');
    if (petHeader) {
        petHeader.addEventListener('click', function(e) {
            if (e.target.closest('.pet-icon-btn')) return;
            togglePetCollapse();
        });
    }

    renderAll();
    setInterval(checkAchievements, 5000);
});