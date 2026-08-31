// ==================== CONSTANTS ====================
const COURSE_DATA = {
    "علوم تجربی": {
        "دهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 1", "units": 2},
            {"name": "عربی، زبان قرآن 1", "units": 2},
            {"name": "فارسی 1", "units": 2},
            {"name": "نگارش 1", "units": 2},
            {"name": "زبان خارجی 1", "units": 3},
            {"name": "جغرافیای عمومی و استان‌شناسی", "units": 2},
            {"name": "تربیت بدنی 1", "units": 2},
            {"name": "آمادگی دفاعی", "units": 3},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "ریاضی 1", "units": 4},
            {"name": "فیزیک 1", "units": 3},
            {"name": "شیمی 1", "units": 3},
            {"name": "زیست‌شناسی 1", "units": 3},
            {"name": "آزمایشگاه علوم تجربی 1", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "یازدهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 2", "units": 2},
            {"name": "عربی، زبان قرآن 2", "units": 2},
            {"name": "فارسی 2", "units": 2},
            {"name": "نگارش 2", "units": 1},
            {"name": "زبان خارجی 2", "units": 3},
            {"name": "تاریخ معاصر ایران", "units": 2},
            {"name": "تربیت بدنی 2", "units": 2},
            {"name": "انسان و محیط زیست", "units": 2},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "ریاضی 2", "units": 4},
            {"name": "فیزیک 2", "units": 3},
            {"name": "شیمی 2", "units": 3},
            {"name": "زیست‌شناسی 2", "units": 4},
            {"name": "آزمایشگاه علوم تجربی 2", "units": 1},
            {"name": "زمین‌شناسی", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "دوازدهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 3", "units": 2},
            {"name": "عربی، زبان قرآن 3", "units": 2},
            {"name": "فارسی 3", "units": 2},
            {"name": "نگارش 3", "units": 2},
            {"name": "زبان خارجی 3", "units": 4},
            {"name": "علوم اجتماعی", "units": 2},
            {"name": "تربیت بدنی 3", "units": 2},
            {"name": "سلامت و بهداشت", "units": 2},
            {"name": "مدیریت خانواده و سبک زندگی", "units": 2},
            {"name": "ریاضی 3", "units": 4},
            {"name": "فیزیک 3", "units": 3},
            {"name": "شیمی 3", "units": 4},
            {"name": "زیست‌شناسی 3", "units": 4},
            {"name": "انضباط", "units": 2}
        ]
    },
    "ریاضی فیزیک": {
        "دهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 1", "units": 2},
            {"name": "عربی، زبان قرآن 1", "units": 2},
            {"name": "فارسی 1", "units": 2},
            {"name": "نگارش 1", "units": 2},
            {"name": "زبان خارجی 1", "units": 3},
            {"name": "جغرافیای عمومی و استان‌شناسی", "units": 2},
            {"name": "تربیت بدنی 1", "units": 2},
            {"name": "آمادگی دفاعی", "units": 3},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "ریاضی 1", "units": 4},
            {"name": "هندسه 1", "units": 2},
            {"name": "فیزیک 1", "units": 4},
            {"name": "شیمی 1", "units": 3},
            {"name": "آزمایشگاه علوم تجربی 1", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "یازدهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 2", "units": 2},
            {"name": "عربی، زبان قرآن 2", "units": 2},
            {"name": "فارسی 2", "units": 2},
            {"name": "نگارش 2", "units": 1},
            {"name": "زبان خارجی 2", "units": 3},
            {"name": "تاریخ معاصر ایران", "units": 2},
            {"name": "تربیت بدنی 2", "units": 2},
            {"name": "انسان و محیط زیست", "units": 2},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "حسابان 1", "units": 3},
            {"name": "هندسه 2", "units": 2},
            {"name": "آمار و احتمال", "units": 2},
            {"name": "فیزیک 2", "units": 4},
            {"name": "شیمی 2", "units": 3},
            {"name": "آزمایشگاه علوم تجربی 2", "units": 1},
            {"name": "زمین‌شناسی", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "دوازدهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 3", "units": 2},
            {"name": "عربی، زبان قرآن 3", "units": 2},
            {"name": "فارسی 3", "units": 2},
            {"name": "نگارش 3", "units": 2},
            {"name": "زبان خارجی 3", "units": 4},
            {"name": "علوم اجتماعی", "units": 2},
            {"name": "تربیت بدنی 3", "units": 2},
            {"name": "سلامت و بهداشت", "units": 2},
            {"name": "مدیریت خانواده و سبک زندگی", "units": 2},
            {"name": "حسابان 2", "units": 3},
            {"name": "هندسه 3", "units": 2},
            {"name": "ریاضیات گسسته", "units": 2},
            {"name": "فیزیک 3", "units": 4},
            {"name": "شیمی 3", "units": 4},
            {"name": "انضباط", "units": 2}
        ]
    },
    "علوم انسانی": {
        "دهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 1", "units": 3},
            {"name": "عربی، زبان قرآن 1", "units": 2},
            {"name": "فارسی 1", "units": 2},
            {"name": "نگارش 1", "units": 2},
            {"name": "علوم و فنون ادبی 1", "units": 2},
            {"name": "زبان خارجی 1", "units": 3},
            {"name": "ریاضی و آمار 1", "units": 3},
            {"name": "تربیت بدنی 1", "units": 2},
            {"name": "آمادگی دفاعی", "units": 3},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "تاریخ 1", "units": 3},
            {"name": "جامعه‌شناسی 1", "units": 2},
            {"name": "جغرافیای عمومی و استان‌شناسی", "units": 2},
            {"name": "اقتصاد", "units": 2},
            {"name": "منطق", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "یازدهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 2", "units": 4},
            {"name": "عربی، زبان قرآن 2", "units": 2},
            {"name": "فارسی 2", "units": 2},
            {"name": "نگارش 2", "units": 1},
            {"name": "علوم و فنون ادبی 2", "units": 2},
            {"name": "زبان خارجی 2", "units": 3},
            {"name": "ریاضی و آمار 2", "units": 2},
            {"name": "تربیت بدنی 2", "units": 2},
            {"name": "انسان و محیط زیست", "units": 2},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "تاریخ 2", "units": 3},
            {"name": "جامعه‌شناسی 2", "units": 3},
            {"name": "جغرافیا 2", "units": 3},
            {"name": "روان‌شناسی", "units": 2},
            {"name": "فلسفه 1", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "دوازدهم": [
            {"name": "تعلیمات دینی (دینی، اخلاق و قرآن) 3", "units": 4},
            {"name": "عربی، زبان قرآن 3", "units": 2},
            {"name": "فارسی 3", "units": 2},
            {"name": "نگارش 3", "units": 2},
            {"name": "علوم و فنون ادبی 3", "units": 2},
            {"name": "زبان خارجی 3", "units": 4},
            {"name": "ریاضی و آمار 3", "units": 2},
            {"name": "تربیت بدنی 3", "units": 2},
            {"name": "سلامت و بهداشت", "units": 2},
            {"name": "مدیریت خانواده و سبک زندگی", "units": 2},
            {"name": "تاریخ 3", "units": 2},
            {"name": "جامعه‌شناسی 3", "units": 3},
            {"name": "جغرافیا 3", "units": 2},
            {"name": "مطالعات فرهنگی", "units": 2},
            {"name": "فلسفه 2", "units": 2},
            {"name": "انضباط", "units": 2}
        ]
    },
    "علوم و معارف اسلامی": {
        "دهم": [
            {"name": "علوم و معارف قرآنی 1", "units": 2},
            {"name": "اصول عقاید 1", "units": 3},
            {"name": "احکام 1", "units": 1},
            {"name": "اخلاق 1", "units": 1},
            {"name": "عربی، زبان قرآن 1", "units": 3},
            {"name": "فارسی 1", "units": 2},
            {"name": "نگارش 1", "units": 2},
            {"name": "علوم و فنون ادبی 1", "units": 2},
            {"name": "زبان خارجی 1", "units": 3},
            {"name": "ریاضی و آمار 1", "units": 3},
            {"name": "تربیت بدنی 1", "units": 2},
            {"name": "آمادگی دفاعی", "units": 3},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "تاریخ 1", "units": 2},
            {"name": "جامعه‌شناسی", "units": 2},
            {"name": "جغرافیای عمومی و استان‌شناسی", "units": 2},
            {"name": "منطق", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "یازدهم": [
            {"name": "علوم و معارف قرآنی 2", "units": 2},
            {"name": "اصول عقاید 2", "units": 3},
            {"name": "احکام 2", "units": 1},
            {"name": "اخلاق 2", "units": 1},
            {"name": "عربی، زبان قرآن 2", "units": 3},
            {"name": "فارسی 2", "units": 2},
            {"name": "نگارش 2", "units": 1},
            {"name": "علوم و فنون ادبی 2", "units": 2},
            {"name": "زبان خارجی 2", "units": 3},
            {"name": "ریاضی و آمار 2", "units": 2},
            {"name": "تربیت بدنی 2", "units": 2},
            {"name": "انسان و محیط زیست", "units": 2},
            {"name": "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)", "units": 2},
            {"name": "تاریخ 2", "units": 2},
            {"name": "مطالعات فرهنگی", "units": 2},
            {"name": "اقتصاد", "units": 2},
            {"name": "فلسفه 1", "units": 2},
            {"name": "روان‌شناسی", "units": 2},
            {"name": "انضباط", "units": 2}
        ],
        "دوازدهم": [
            {"name": "علوم و معارف قرآنی 3", "units": 2},
            {"name": "اصول عقاید 3", "units": 3},
            {"name": "احکام 3", "units": 1},
            {"name": "اخلاق 3", "units": 1},
            {"name": "عربی، زبان قرآن 3", "units": 4},
            {"name": "فارسی 3", "units": 2},
            {"name": "نگارش 3", "units": 2},
            {"name": "علوم و فنون ادبی 3", "units": 2},
            {"name": "زبان خارجی 3", "units": 4},
            {"name": "ریاضی و آمار 3", "units": 2},
            {"name": "تربیت بدنی 3", "units": 2},
            {"name": "سلامت و بهداشت", "units": 2},
            {"name": "مدیریت خانواده و سبک زندگی", "units": 2},
            {"name": "تاریخ 3", "units": 2},
            {"name": "جریان‌شناسی اندیشه‌های معاصر", "units": 2},
            {"name": "فلسفه 2", "units": 2},
            {"name": "انضباط", "units": 2}
        ]
    }
};

const TOTAL_UNITS_INFO = {
    "علوم تجربی": {"دهم": 37, "یازدهم": 37, "دوازدهم": 37},
    "ریاضی فیزیک": {"دهم": 37, "یازدهم": 37, "دوازدهم": 37},
    "علوم انسانی": {"دهم": 37, "یازدهم": 37, "دوازدهم": 37},
    "علوم و معارف اسلامی": {"دهم": 39, "یازدهم": 38, "دوازدهم": 37}
};

const VOCATIONAL_COURSES = [
    "تربیت بدنی",
    "درس انتخابی",
    "آمادگی دفاعی",
    "هنر",
    "تفکر و سواد رسانه‌ای",
    "کارگاه کارآفرینی و تولید",
    "مدیریت خانواده و سبک زندگی",
    "سلامت و بهداشت"
];

// ==================== UTILITY FUNCTIONS ====================
const Utils = {
    toPersianNumbers(input) {
        if (!input && input !== 0) return '';
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return input.toString().replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
    },

    roundGrade(grade, decimals = 2) {
        if (isNaN(grade)) return grade;
        const factor = Math.pow(10, decimals);
        return Math.round(grade * factor) / factor;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    },

    shortenCourseName(name) {
        const shortNames = {
            "تعلیمات دینی (دینی، اخلاق و قرآن)": "دینی",
            "عربی، زبان قرآن": "عربی",
            "جغرافیای عمومی و استان‌شناسی": "جغرافیا",
            "درس انتخابی (هنر، تفکر و سواد رسانه‌ای، کارگاه کارآفرینی و تولید)": "درس انتخابی",
            "آزمایشگاه علوم تجربی": "آزمایشگاه",
            "انسان و محیط زیست": "انسان و محیط زیست",
            "مدیریت خانواده و سبک زندگی": "مدیریت خانواده",
            "علوم و معارف قرآنی": "معارف قرآنی",
            "علوم و فنون ادبی": "علوم ادبی",
            "ریاضی و آمار": "ریاضی و آمار"
        };

        for (const [long, short] of Object.entries(shortNames)) {
            if (name.includes(long)) {
                return name.replace(long, short);
            }
        }

        return name.length > 25 ? name.substring(0, 22) + '...' : name;
    },

    isVocationalCourse(courseName) {
        return VOCATIONAL_COURSES.some(vc => courseName.includes(vc));
    },

    formatDate(date) {
        const d = new Date(date);
        const year = d.toLocaleDateString('fa-IR', { year: 'numeric' });
        const month = d.toLocaleDateString('fa-IR', { month: '2-digit' });
        const day = d.toLocaleDateString('fa-IR', { day: '2-digit' });
        return `${year}/${month}/${day}`;
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// ==================== GPA CALCULATOR CLASS ====================
class GPACalculator {
    constructor() {
        this.courses = [];
        this.currentCourses = [];
        this.totalUnits = 35;
        this.savedResults = [];
        this.tabs = ['academic-info', 'summer-courses', 'results', 'settings'];
        this.currentTabIndex = 0;
        this.lastResult = null;
        this.summerStats = {
            totalUnits: 0,
            inPersonUnits: 0,
            remoteUnits: 0
        };
        this.selectedCourses = new Set();
        this.autoSaveTimer = null;
        this.init();
    }

    initMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const closeBtn = document.getElementById('sidebarCloseBtn');
        
        const openMenu = () => {
            if (sidebar) sidebar.classList.add('open');
            if (overlay) overlay.classList.add('active');
            if (menuBtn) {
                menuBtn.classList.add('active');
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
            document.body.style.overflow = 'hidden';
        };
        
        const closeMenu = () => {
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            if (menuBtn) {
                menuBtn.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            document.body.style.overflow = '';
        };
        
        if (menuBtn) menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar && sidebar.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);
        
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    adjustForMobile() {
        const isMobile = window.innerWidth <= 768;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const menuBtn = document.getElementById('mobileMenuBtn');
        
        if (!isMobile) {
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            if (menuBtn) {
                menuBtn.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            document.body.style.overflow = '';
        }
    }

    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.updateCourseList();
        this.updateUnitsInfo();
        this.updateCoursesCount();
        this.setupKeyboardShortcuts();
        this.checkGradeSpecificRules();
        
        // ریسپانسیو موبایل
        this.initMobileMenu();
        this.adjustForMobile();
        window.addEventListener('resize', () => this.adjustForMobile());
        
        this.showNotification('محاسبه‌گر معدل هوشمند آماده به کار است', 'info');
        this.startAutoSave();
    }

    startAutoSave() {
        setInterval(() => {
            this.saveToLocalStorage();
        }, 30000);
    }

    setupEventListeners() {
        // تب‌ها
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        const prevBtn = document.getElementById('prevTabBtn');
        const nextBtn = document.getElementById('nextTabBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousTab());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextTab());

        const disciplineSelect = document.getElementById('discipline');
        const gradeSelect = document.getElementById('grade');
        
        if (disciplineSelect) {
            disciplineSelect.addEventListener('change', () => {
                this.updateCourseList();
                this.updateUnitsInfo();
                this.saveToLocalStorage();
                this.checkGradeSpecificRules();
                this.refreshAllCourseDropdowns();
            });
        }

        if (gradeSelect) {
            gradeSelect.addEventListener('change', () => {
                this.updateCourseList();
                this.updateUnitsInfo();
                this.saveToLocalStorage();
                this.checkGradeSpecificRules();
                this.refreshAllCourseDropdowns();
            });
        }

        document.getElementById('add-course')?.addEventListener('click', () => this.addCourse());
        document.getElementById('calculate-btn')?.addEventListener('click', () => this.calculate());
        document.getElementById('calculate-footer-btn')?.addEventListener('click', () => {
            this.calculate();
            this.switchTab('results');
        });
        document.getElementById('clear-all-btn')?.addEventListener('click', () => this.clearAll());
        document.getElementById('newCalculationBtn')?.addEventListener('click', () => this.newCalculation());
        document.getElementById('helpBtn')?.addEventListener('click', () => this.showHelp());
        document.getElementById('homeBtn')?.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        document.getElementById('gotoSummerBtn')?.addEventListener('click', () => this.switchTab('summer-courses'));
        document.getElementById('gotoResultsBtn')?.addEventListener('click', () => this.switchTab('results'));

        document.getElementById('save-result-btn')?.addEventListener('click', () => this.saveResult());
        document.getElementById('print-result-btn')?.addEventListener('click', () => this.printResult());

        document.getElementById('reset-defaults')?.addEventListener('click', () => this.resetDefaults());
        document.getElementById('export-data')?.addEventListener('click', () => this.exportData());
        document.getElementById('import-data')?.addEventListener('click', () => this.triggerImport());
        document.getElementById('import-file')?.addEventListener('change', (e) => this.importData(e));

        const showUnitsCheckbox = document.getElementById('show-units');
        if (showUnitsCheckbox) {
            showUnitsCheckbox.addEventListener('change', (e) => {
                this.toggleUnitsDisplay(e.target.checked);
                this.saveSettingsToStorage();
            });
        }

        const compactModeCheckbox = document.getElementById('compact-mode');
        if (compactModeCheckbox) {
            compactModeCheckbox.addEventListener('change', (e) => {
                this.toggleCompactMode(e.target.checked);
                this.saveSettingsToStorage();
            });
        }

        const juneGPAInput = document.getElementById('june-gpa');
        const minGPAInput = document.getElementById('min-gpa');
        
        if (juneGPAInput) {
            juneGPAInput.addEventListener('input', Utils.debounce(() => {
                this.saveToLocalStorage();
            }, 500));
        }
        
        if (minGPAInput) {
            minGPAInput.addEventListener('input', Utils.debounce(() => {
                this.saveToLocalStorage();
            }, 500));
        }

        // دکمه‌های موبایل در فوتر
        const mobileHomeBtn = document.getElementById('mobileHomeBtn');
        const mobileHelpBtn = document.getElementById('mobileHelpBtn');
        const mobileNewCalcBtn = document.getElementById('mobileNewCalcBtn');
        
        if (mobileHomeBtn) mobileHomeBtn.addEventListener('click', () => window.location.href = '../index.html');
        if (mobileHelpBtn) mobileHelpBtn.addEventListener('click', () => this.showHelp());
        if (mobileNewCalcBtn) mobileNewCalcBtn.addEventListener('click', () => this.newCalculation());
    }

    calculateAnnualGrade(monthly1, final1, monthly2, final2) {
        const m1 = parseFloat(monthly1) || 0;
        const f1 = parseFloat(final1) || 0;
        const m2 = parseFloat(monthly2) || 0;
        const f2 = parseFloat(final2) || 0;
        
        if (m1 === 0 && f1 === 0 && m2 === 0 && f2 === 0) return null;
        
        const total = (m1 * 1) + (f1 * 2) + (m2 * 1) + (f2 * 4);
        return Utils.roundGrade(total / 8);
    }

    calculateSummerGrade(finalScore, monthlyScore = 0, isInPerson = true) {
        const final = parseFloat(finalScore) || 0;
        const monthly = parseFloat(monthlyScore) || 0;
        
        if (isInPerson) {
            return Utils.roundGrade((final * 3 + monthly) / 4);
        } else {
            return Utils.roundGrade(final);
        }
    }

    updateUnitsInfo() {
        const discipline = document.getElementById('discipline').value;
        const grade = document.getElementById('grade').value;
        const unitsInfo = document.getElementById('units-info');
        const totalUnits = document.getElementById('total-units');
        
        if (TOTAL_UNITS_INFO[discipline] && TOTAL_UNITS_INFO[discipline][grade]) {
            this.totalUnits = TOTAL_UNITS_INFO[discipline][grade];
            
            if (unitsInfo) {
                unitsInfo.innerHTML = `<i class="fas fa-info-circle"></i> واحدهای پایه ${grade} رشته ${discipline}: ${Utils.toPersianNumbers(this.totalUnits)} واحد`;
            }
            
            if (totalUnits) {
                totalUnits.textContent = Utils.toPersianNumbers(this.totalUnits);
            }
        }
    }

    updateCourseList() {
        const discipline = document.getElementById('discipline').value;
        const grade = document.getElementById('grade').value;
        
        this.currentCourses = COURSE_DATA[discipline]?.[grade] || [];
    }

    rebuildSelectedCourses() {
        this.selectedCourses.clear();
        this.courses.forEach(course => {
            const nameSelect = course.querySelector('.course-name');
            if (nameSelect && nameSelect.value) {
                this.selectedCourses.add(nameSelect.value);
            }
        });
    }

    refreshAllCourseDropdowns() {
        this.rebuildSelectedCourses();
        this.courses.forEach(course => {
            this.refreshSingleCourseDropdown(course);
        });
    }

    refreshSingleCourseDropdown(courseElement) {
        const nameSelect = courseElement.querySelector('.course-name');
        if (!nameSelect) return;

        const currentValue = nameSelect.value;
        
        const tempSelected = new Set(this.selectedCourses);
        if (currentValue) {
            tempSelected.delete(currentValue);
        }
        
        const availableCourses = this.currentCourses.filter(
            course => !tempSelected.has(course.name)
        );

        availableCourses.sort((a, b) => a.name.localeCompare(b.name));

        const previousValue = nameSelect.value;
        
        nameSelect.innerHTML = availableCourses.map(course => 
            `<option value="${course.name}" data-units="${course.units}">${Utils.shortenCourseName(course.name)}</option>`
        ).join('');

        if (availableCourses.some(c => c.name === previousValue)) {
            nameSelect.value = previousValue;
        } else if (availableCourses.length > 0) {
            nameSelect.value = availableCourses[0].name;
        }

        this.updateCourseUnits(courseElement);
        this.checkVocationalCourse(courseElement);
    }

    updateCourseUnits(courseElement) {
        const nameSelect = courseElement.querySelector('.course-name');
        const unitsInput = courseElement.querySelector('.course-units');
        
        if (nameSelect && unitsInput) {
            const selectedOption = nameSelect.options[nameSelect.selectedIndex];
            if (selectedOption) {
                unitsInput.value = selectedOption.dataset.units;
            }
        }
    }

    checkSummerUnitsLimit() {
        const currentUnits = this.summerStats.totalUnits;
        const newCourseUnits = this.currentCourses.length > 0 ? this.currentCourses[0].units : 3;
        
        if (currentUnits + newCourseUnits > 35) {
            this.showNotification('حداکثر واحدهای مجاز در تابستان ۳۵ واحد است', 'error');
            return false;
        }
        return true;
    }

    addCourse() {
        const emptyState = document.getElementById('empty-state');
        const coursesContainer = document.getElementById('courses-container');
        
        if (!this.checkSummerUnitsLimit()) {
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        const courseElement = this.createCourseElement();
        
        if (coursesContainer) {
            coursesContainer.appendChild(courseElement);
            this.courses.push(courseElement);
            this.updateCourseNumbers();
            this.updateCoursesCount();
            this.updateSummerStats();
            
            this.refreshAllCourseDropdowns();
            
            this.saveToLocalStorage();
            this.showNotification('درس جدید اضافه شد', 'success');
        }
    }

    createCourseElement() {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-item';
        
        const availableCourses = this.currentCourses.filter(
            course => !this.selectedCourses.has(course.name)
        );
        
        courseDiv.innerHTML = `
            <div class="course-header">
                <div class="course-title">
                    <i class="fas fa-book"></i>
                    درس ${this.courses.length + 1}
                </div>
                <button class="delete-btn" title="حذف درس">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="course-body">
                <div class="course-field">
                    <label>نام درس</label>
                    <select class="course-name">
                        ${availableCourses.map(course => 
                            `<option value="${course.name}" data-units="${course.units}">${Utils.shortenCourseName(course.name)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="course-field">
                    <label>واحد</label>
                    <input type="text" class="course-units" readonly>
                </div>
                <div class="course-field">
                    <label>نوع حضور</label>
                    <select class="attendance-type">
                        <option value="in-person">حضوری</option>
                        <option value="remote">غیرحضوری</option>
                    </select>
                </div>
                <div class="course-field">
                    <label>نمره پایانی تابستان</label>
                    <input type="number" class="summer-final" placeholder="مثلاً ۱۴.۵" min="0" max="20" step="0.01">
                </div>
                <div class="course-field attendance-monthly">
                    <label>نمره مستمر تابستان</label>
                    <input type="number" class="summer-monthly" placeholder="مثلاً ۱۶" min="0" max="20" step="0.01" value="0">
                </div>
                <div class="course-field">
                    <label>نمره تابستانه</label>
                    <input type="text" class="summer-calculated" readonly>
                </div>
            </div>
            <div class="course-details-btn">
                <button class="btn btn-sm btn-outline toggle-details" type="button">
                    <i class="fas fa-chevron-down"></i>
                    جزئیات نمرات خرداد
                </button>
            </div>
            <div class="course-details" style="display: none;">
                <div class="course-field">
                    <label>نمره سالانه خرداد</label>
                    <input type="number" class="june-annual" placeholder="مثلاً ۱۴.۵۰" min="0" max="20" step="0.01" readonly>
                </div>
                <div class="course-field">
                    <label>مستمر نوبت اول</label>
                    <input type="number" class="monthly1" placeholder="مثلاً ۱۶" min="0" max="20" step="0.01">
                </div>
                <div class="course-field">
                    <label>پایانی نوبت اول</label>
                    <input type="number" class="final1" placeholder="مثلاً ۱۴" min="0" max="20" step="0.01">
                </div>
                <div class="course-field">
                    <label>مستمر نوبت دوم</label>
                    <input type="number" class="monthly2" placeholder="مثلاً ۱۷" min="0" max="20" step="0.01">
                </div>
                <div class="course-field">
                    <label>پایانی نوبت دوم</label>
                    <input type="number" class="final2" placeholder="مثلاً ۱۸" min="0" max="20" step="0.01">
                </div>
            </div>
        `;

        this.attachCourseEvents(courseDiv);
        return courseDiv;
    }

    attachCourseEvents(courseDiv) {
        const nameSelect = courseDiv.querySelector('.course-name');
        const attendanceType = courseDiv.querySelector('.attendance-type');
        const summerFinal = courseDiv.querySelector('.summer-final');
        const summerMonthly = courseDiv.querySelector('.summer-monthly');
        const monthlyField = courseDiv.querySelector('.attendance-monthly');
        const toggleBtn = courseDiv.querySelector('.toggle-details');
        const details = courseDiv.querySelector('.course-details');
        const courseBody = courseDiv.querySelector('.course-body');
        
        const juneAnnual = courseDiv.querySelector('.june-annual');
        const monthly1 = courseDiv.querySelector('.monthly1');
        const final1 = courseDiv.querySelector('.final1');
        const monthly2 = courseDiv.querySelector('.monthly2');
        const final2 = courseDiv.querySelector('.final2');

        toggleBtn.addEventListener('click', () => {
            const isHidden = details.style.display === 'none';
            details.style.display = isHidden ? 'grid' : 'none';
            toggleBtn.innerHTML = isHidden ? 
                '<i class="fas fa-chevron-up"></i> بستن جزئیات' : 
                '<i class="fas fa-chevron-down"></i> جزئیات نمرات خرداد';
        });

        const calculateFromDetails = () => {
            const calculated = this.calculateAnnualGrade(
                monthly1.value, final1.value, monthly2.value, final2.value
            );
            if (calculated !== null) {
                juneAnnual.value = calculated.toFixed(2);
                this.saveToLocalStorage();
            } else {
                juneAnnual.value = '';
            }
        };

        monthly1.addEventListener('input', calculateFromDetails);
        final1.addEventListener('input', calculateFromDetails);
        monthly2.addEventListener('input', calculateFromDetails);
        final2.addEventListener('input', calculateFromDetails);

        nameSelect.addEventListener('change', () => {
            this.updateCourseUnits(courseDiv);
            this.rebuildSelectedCourses();
            
            this.courses.forEach(course => {
                if (course !== courseDiv) {
                    this.refreshSingleCourseDropdown(course);
                }
            });
            
            this.checkVocationalCourse(courseDiv);
            this.saveToLocalStorage();
        });

        attendanceType.addEventListener('change', () => {
            if (attendanceType.value === 'remote') {
                if (monthlyField) {
                    monthlyField.style.display = 'none';
                }
                if (summerMonthly) {
                    summerMonthly.value = '0';
                }
                if (courseBody) {
                    courseBody.classList.add('remote-layout');
                }
            } else {
                if (monthlyField) {
                    monthlyField.style.display = 'block';
                }
                if (courseBody) {
                    courseBody.classList.remove('remote-layout');
                }
            }
            this.calculateCourseSummerGrade(courseDiv);
            this.updateSummerStats();
            this.saveToLocalStorage();
        });

        const calculateSummer = () => {
            this.calculateCourseSummerGrade(courseDiv);
            this.updateSummerStats();
            this.saveToLocalStorage();
        };

        summerFinal.addEventListener('input', calculateSummer);
        summerMonthly.addEventListener('input', calculateSummer);

        const deleteBtn = courseDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.removeCourse(courseDiv));

        setTimeout(() => {
            this.updateCourseUnits(courseDiv);
            this.checkVocationalCourse(courseDiv);
            calculateFromDetails();
            
            if (attendanceType && monthlyField && courseBody) {
                if (attendanceType.value === 'remote') {
                    monthlyField.style.display = 'none';
                    courseBody.classList.add('remote-layout');
                } else {
                    monthlyField.style.display = 'block';
                    courseBody.classList.remove('remote-layout');
                }
            }
        }, 100);
    }

    checkVocationalCourse(courseElement) {
        const nameSelect = courseElement.querySelector('.course-name');
        const selectedOption = nameSelect.options[nameSelect.selectedIndex];
        const courseName = selectedOption?.text || '';
        
        if (Utils.isVocationalCourse(courseName)) {
            const attendanceType = courseElement.querySelector('.attendance-type');
            attendanceType.disabled = true;
            attendanceType.value = 'in-person';
            
            const monthlyField = courseElement.querySelector('.attendance-monthly');
            const courseBody = courseElement.querySelector('.course-body');
            
            if (monthlyField) {
                monthlyField.style.display = 'block';
            }
            if (courseBody) {
                courseBody.classList.remove('remote-layout');
            }
        } else {
            const attendanceType = courseElement.querySelector('.attendance-type');
            attendanceType.disabled = false;
        }
    }

    calculateCourseSummerGrade(courseElement) {
        const finalScore = parseFloat(courseElement.querySelector('.summer-final').value) || 0;
        const monthlyScore = parseFloat(courseElement.querySelector('.summer-monthly').value) || 0;
        const attendanceType = courseElement.querySelector('.attendance-type').value;
        const calculated = courseElement.querySelector('.summer-calculated');
        
        if (finalScore > 0) {
            const summerGrade = this.calculateSummerGrade(
                finalScore, 
                monthlyScore, 
                attendanceType === 'in-person'
            );
            calculated.value = Utils.toPersianNumbers(summerGrade.toFixed(2));
            return summerGrade;
        } else {
            calculated.value = '';
            return 0;
        }
    }

    getCourseJuneAnnual(courseElement) {
        const juneAnnual = parseFloat(courseElement.querySelector('.june-annual').value);
        if (!isNaN(juneAnnual) && juneAnnual > 0) return juneAnnual;

        const monthly1 = courseElement.querySelector('.monthly1').value;
        const final1 = courseElement.querySelector('.final1').value;
        const monthly2 = courseElement.querySelector('.monthly2').value;
        const final2 = courseElement.querySelector('.final2').value;
        
        const calculated = this.calculateAnnualGrade(monthly1, final1, monthly2, final2);
        return calculated !== null ? calculated : 0;
    }

    removeCourse(courseElement) {
        const index = this.courses.indexOf(courseElement);
        if (index > -1) {
            this.courses.splice(index, 1);
            courseElement.remove();
            this.updateCourseNumbers();
            this.updateCoursesCount();
            this.updateSummerStats();
            
            this.refreshAllCourseDropdowns();
            
            const emptyState = document.getElementById('empty-state');
            if (this.courses.length === 0 && emptyState) {
                emptyState.style.display = 'flex';
            }
            
            this.saveToLocalStorage();
            this.showNotification('درس حذف شد', 'warning');
        }
    }

    updateCourseNumbers() {
        this.courses.forEach((course, index) => {
            const titleElement = course.querySelector('.course-title');
            if (titleElement) {
                titleElement.innerHTML = `
                    <i class="fas fa-book"></i>
                    درس ${Utils.toPersianNumbers(index + 1)}
                `;
            }
        });
    }

    updateCoursesCount() {
        const count = this.courses.length;
        const coursesBadge = document.getElementById('courses-count-badge');
        const summerCoursesCount = document.getElementById('summer-courses-count');
        
        if (coursesBadge) {
            coursesBadge.innerHTML = `
                <i class="fas fa-book-open"></i>
                <span>تعداد دروس: ${Utils.toPersianNumbers(count)}</span>
            `;
        }
        
        if (summerCoursesCount) {
            summerCoursesCount.textContent = Utils.toPersianNumbers(count);
        }
    }

    updateSummerStats() {
        let totalUnits = 0;
        let inPersonUnits = 0;
        let remoteUnits = 0;
        
        this.courses.forEach(course => {
            const unitsInput = course.querySelector('.course-units');
            const attendanceType = course.querySelector('.attendance-type').value;
            const units = parseFloat(unitsInput?.value) || 0;
            
            totalUnits += units;
            if (attendanceType === 'in-person') {
                inPersonUnits += units;
            } else {
                remoteUnits += units;
            }
        });
        
        this.summerStats = { totalUnits, inPersonUnits, remoteUnits };
        
        const summerUnits = document.getElementById('summer-units');
        const summerInPerson = document.getElementById('summer-in-person');
        const summerRemote = document.getElementById('summer-remote');
        
        if (summerUnits) summerUnits.textContent = Utils.toPersianNumbers(totalUnits);
        if (summerInPerson) summerInPerson.textContent = Utils.toPersianNumbers(inPersonUnits);
        if (summerRemote) summerRemote.textContent = Utils.toPersianNumbers(remoteUnits);
        
        this.checkSummerLimits();
    }

    checkSummerLimits() {
        const warningElement = document.getElementById('summer-limit-warning');
        const warningText = document.getElementById('summer-limit-text');
        if (!warningElement || !warningText) return;
        
        let warnings = [];
        
        if (this.summerStats.totalUnits > 35) {
            warnings.push('⚠️ مجموع واحدها بیش از ۳۵ واحد مجاز است');
        }
        
        if (this.summerStats.inPersonUnits > 10) {
            warnings.push('⚠️ واحدهای حضوری بیش از ۱۰ واحد مجاز است');
        }
        
        if (warnings.length > 0) {
            warningText.innerHTML = warnings.join('<br>');
            warningElement.style.display = 'flex';
        } else {
            warningElement.style.display = 'none';
        }
    }

    validateInputs() {
        const juneGPA = document.getElementById('june-gpa').value;
        const minGPA = document.getElementById('min-gpa').value;

        if (!juneGPA) {
            this.showNotification('لطفاً معدل خرداد را وارد کنید', 'error');
            return false;
        }
        
        const juneGPAFloat = parseFloat(juneGPA);
        if (isNaN(juneGPAFloat) || juneGPAFloat < 0 || juneGPAFloat > 20) {
            this.showNotification('معدل خرداد باید بین ۰ تا ۲۰ باشد', 'error');
            return false;
        }
        
        if (!minGPA) {
            this.showNotification('لطفاً حداقل معدل را وارد کنید', 'error');
            return false;
        }
        
        const minGPAFloat = parseFloat(minGPA);
        if (isNaN(minGPAFloat) || minGPAFloat < 0 || minGPAFloat > 20) {
            this.showNotification('حداقل معدل باید بین ۰ تا ۲۰ باشد', 'error');
            return false;
        }

        if (this.courses.length === 0) {
            this.showNotification('لطفاً حداقل یک درس اضافه کنید', 'warning');
            return false;
        }

        for (let i = 0; i < this.courses.length; i++) {
            const course = this.courses[i];
            const finalScore = course.querySelector('.summer-final').value;
            
            if (!finalScore) {
                this.showNotification(`نمره پایانی درس ${Utils.toPersianNumbers(i + 1)} را وارد کنید`, 'error');
                return false;
            }

            const finalScoreFloat = parseFloat(finalScore);
            if (isNaN(finalScoreFloat) || finalScoreFloat < 0 || finalScoreFloat > 20) {
                this.showNotification(`نمره پایانی درس ${Utils.toPersianNumbers(i + 1)} باید بین ۰ تا ۲۰ باشد`, 'error');
                return false;
            }
        }

        return true;
    }

    analyzeSingleCourseEligibility(courseElement) {
        const nameSelect = courseElement.querySelector('.course-name');
        const selectedOption = nameSelect.options[nameSelect.selectedIndex];
        const courseName = selectedOption?.text || '';
        const units = parseFloat(courseElement.querySelector('.course-units').value) || 0;
        
        const juneAnnual = this.getCourseJuneAnnual(courseElement);
        
        const summerFinal = parseFloat(courseElement.querySelector('.summer-final').value) || 0;
        const summerMonthly = parseFloat(courseElement.querySelector('.summer-monthly').value) || 0;
        const attendanceType = courseElement.querySelector('.attendance-type').value;
        
        const summerGrade = this.calculateSummerGrade(summerFinal, summerMonthly, attendanceType === 'in-person');
        
        const grade = document.getElementById('grade').value;
        const isFinalExam = (grade === 'دوازدهم');
        
        let eligible = false;
        let reason = '';
        let shouldReplace = false;
        
        if (Utils.isVocationalCourse(courseName)) {
            eligible = false;
            reason = '❌ درس مهارتی مشمول تک‌ماده نمی‌شود';
            shouldReplace = false;
        }
        else if (juneAnnual < 7 && juneAnnual > 0) {
            if (summerGrade > 0 && summerGrade >= 7) {
                eligible = true;
                reason = '✅ قبول با نمره تابستان (جبران مردودی)';
                shouldReplace = true;
            } else {
                eligible = false;
                reason = '❌ نمره سالانه کمتر از ۷ - مردود قطعی (نمره تابستان کافی نیست)';
                shouldReplace = false;
            }
        }
        else if (juneAnnual >= 7 && juneAnnual < 10) {
            if (summerGrade > juneAnnual) {
                eligible = true;
                reason = '✅ مشمول تک‌ماده (نمره تابستان بهتر است)';
                shouldReplace = true;
            } else if (summerGrade > 0) {
                eligible = true;
                reason = '✅ مشمول تک‌ماده (نمره تابستان بهتر نیست)';
                shouldReplace = false;
            } else {
                eligible = true;
                reason = '✅ مشمول تک‌ماده (بدون نمره تابستان)';
                shouldReplace = false;
            }
        }
        else if (juneAnnual >= 10) {
            if (summerGrade > juneAnnual) {
                eligible = true;
                reason = '✅ قبول - نمره تابستان بهتر است';
                shouldReplace = true;
            } else {
                eligible = true;
                reason = '✅ قبول - نیازی به تک‌ماده نیست';
                shouldReplace = false;
            }
        } else {
            reason = '⚠️ نمرات خرداد وارد نشده است';
            shouldReplace = false;
        }
        
        if (isFinalExam && juneAnnual >= 10) {
            const final2 = parseFloat(courseElement.querySelector('.final2').value) || 0;
            if (final2 < 7 && final2 > 0 && summerGrade > juneAnnual) {
                reason = '✅ مشمول تک‌ماده (نمره برگه کمتر از ۷)';
                shouldReplace = true;
            }
        }
        
        return {
            eligible,
            reason,
            juneAnnual,
            summerGrade,
            courseName,
            units,
            shouldReplace
        };
    }

    calculate() {
        if (!this.validateInputs()) return;

        const juneGPA = parseFloat(document.getElementById('june-gpa').value);
        const minGPA = parseFloat(document.getElementById('min-gpa').value);

        let totalPoints = juneGPA * this.totalUnits;
        
        const analysisResults = [];
        let eligibleCoursesCount = 0;
        let replacedCoursesCount = 0;

        this.courses.forEach(course => {
            const analysis = this.analyzeSingleCourseEligibility(course);
            analysisResults.push(analysis);
            
            const units = analysis.units;
            const juneAnnual = analysis.juneAnnual;
            const summerGrade = analysis.summerGrade;
            
            if (analysis.shouldReplace && summerGrade > 0) {
                if (juneAnnual > 0) {
                    totalPoints -= juneAnnual * units;
                }
                totalPoints += summerGrade * units;
                
                replacedCoursesCount++;
                
                if (analysis.reason.includes('مشمول تک‌ماده') || 
                    analysis.reason.includes('جبران مردودی')) {
                    eligibleCoursesCount++;
                }
            }
        });

        const newGPA = totalPoints / this.totalUnits;
        const roundedNewGPA = Utils.roundGrade(newGPA);
        
        let overallEligible = true;
        let overallMessage = '';
        
        if (eligibleCoursesCount > 4) {
            overallEligible = false;
            overallMessage = `⚠️ تعداد دروس مشمول تک‌ماده (${eligibleCoursesCount} درس) بیش از حد مجاز (۴ درس) است`;
        } else if (roundedNewGPA < 10 && eligibleCoursesCount > 0) {
            overallEligible = false;
            overallMessage = `⚠️ معدل کل (${Utils.toPersianNumbers(roundedNewGPA.toFixed(2))}) کمتر از ۱۰ است - شرط معدل برای تک‌ماده محقق نیست`;
        }

        this.displayResults(juneGPA, roundedNewGPA, minGPA, {
            analysisResults,
            eligibleCoursesCount,
            replacedCoursesCount,
            overallEligible,
            overallMessage
        });
        
        this.showNotification('محاسبه با موفقیت انجام شد', 'success');
    }

    displayResults(currentGPA, newGPA, minGPA, details = null) {
        const currentGpaElement = document.getElementById('current-gpa');
        const newGpaElement = document.getElementById('new-gpa');
        const statusContainer = document.getElementById('status-container');
        const statusIcon = document.getElementById('status-icon');
        const statusTitle = document.getElementById('status-title');
        const statusDescription = document.getElementById('status-description');
        const detailedAnalysis = document.getElementById('detailed-analysis');
        
        if (currentGpaElement) {
            currentGpaElement.textContent = Utils.toPersianNumbers(currentGPA.toFixed(2));
        }
        
        if (newGpaElement) {
            newGpaElement.textContent = Utils.toPersianNumbers(newGPA.toFixed(2));
        }

        if (detailedAnalysis && details) {
            let analysisHTML = '';
            
            details.analysisResults.forEach((result, index) => {
                const eligibleClass = result.eligible ? 'eligible' : 'not-eligible';
                const statusClass = result.reason.includes('✅') ? 'success' : 
                                    result.reason.includes('⚠️') ? 'warning' : 'error';
                
                analysisHTML += `
                    <div class="analysis-item ${eligibleClass}">
                        <div class="analysis-header">
                            <span>درس ${Utils.toPersianNumbers(index + 1)}: ${result.courseName}</span>
                            <span class="badge">${result.units} واحد</span>
                        </div>
                        <div class="analysis-details">
                            <div>نمره سالانه خرداد: ${result.juneAnnual > 0 ? Utils.toPersianNumbers(result.juneAnnual.toFixed(2)) : '---'}</div>
                            <div>نمره تابستانه: ${result.summerGrade > 0 ? Utils.toPersianNumbers(result.summerGrade.toFixed(2)) : '---'}</div>
                            <div class="status ${statusClass}">${result.reason}</div>
                        </div>
                    </div>
                `;
            });
            
            if (details.overallMessage) {
                analysisHTML += `
                    <div class="analysis-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        ${details.overallMessage}
                    </div>
                `;
            }
            
            if (details.eligibleCoursesCount > 0) {
                analysisHTML += `
                    <div class="analysis-info">
                        <i class="fas fa-info-circle"></i>
                        تعداد دروس مشمول تک‌ماده: ${Utils.toPersianNumbers(details.eligibleCoursesCount)} درس
                        (${Utils.toPersianNumbers(details.replacedCoursesCount)} درس جایگزین شد)
                    </div>
                `;
            }
            
            detailedAnalysis.innerHTML = analysisHTML;
        }

        if (statusContainer && statusIcon && statusTitle && statusDescription) {
            const statusIconContainer = statusContainer.querySelector('.result-status-icon');
            
            let statusClass = '';
            let iconClass = '';
            let title = '';
            let description = '';
            
            if (newGPA >= minGPA) {
                if (details && details.overallMessage) {
                    statusClass = 'warning';
                    iconClass = 'fa-exclamation-triangle';
                    title = '⚠️ قبول مشروط';
                    description = details.overallMessage;
                } else {
                    statusClass = 'success';
                    iconClass = 'fa-check-circle';
                    title = '✅ قبول در شرط علمی';
                    description = `معدل شما از ${Utils.toPersianNumbers(minGPA.toFixed(2))} بیشتر است`;
                    
                    if (details?.eligibleCoursesCount > 0) {
                        description += ` (با استفاده از ${Utils.toPersianNumbers(details.eligibleCoursesCount)} درس تک‌ماده)`;
                    }
                }
            } else {
                statusClass = 'error';
                iconClass = 'fa-times-circle';
                title = '❌ رد در شرط علمی';
                description = `معدل شما از ${Utils.toPersianNumbers(minGPA.toFixed(2))} کمتر است`;
            }
            
            if (statusIconContainer) {
                statusIconContainer.className = `result-status-icon ${statusClass}`;
            }
            
            statusIcon.className = `fas ${iconClass}`;
            statusTitle.textContent = title;
            statusDescription.textContent = description;
        }

        this.lastResult = {
            date: new Date().toISOString(),
            currentGPA,
            newGPA,
            minGPA,
            coursesCount: this.courses.length,
            eligibleCoursesCount: details?.eligibleCoursesCount || 0,
            replacedCoursesCount: details?.replacedCoursesCount || 0,
            overallEligible: details?.overallEligible !== false
        };
    }

    saveResult() {
        if (!this.lastResult) {
            this.showNotification('ابتدا یک محاسبه انجام دهید', 'warning');
            return;
        }

        const result = {
            id: Utils.generateId(),
            ...this.lastResult,
            discipline: document.getElementById('discipline').value,
            grade: document.getElementById('grade').value,
            formattedDate: Utils.formatDate(new Date())
        };

        this.savedResults.push(result);
        Utils.saveToStorage('gpaSavedResults', this.savedResults);
        
        this.showNotification('نتیجه با موفقیت ذخیره شد', 'success');
    }

    printResult() {
        if (!this.lastResult) {
            this.showNotification('ابتدا یک محاسبه انجام دهید', 'warning');
            return;
        }

        const discipline = document.getElementById('discipline').value;
        const grade = document.getElementById('grade').value;
        const currentGPA = document.getElementById('current-gpa').textContent;
        const newGPA = document.getElementById('new-gpa').textContent;
        const statusTitle = document.getElementById('status-title').textContent;
        const detailedAnalysis = document.getElementById('detailed-analysis')?.innerHTML || '';

        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="fa">
            <head>
                <meta charset="UTF-8">
                <title>نتیجه محاسبه معدل</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');
                    body {
                        font-family: 'Vazirmatn', sans-serif;
                        padding: 40px;
                        background: white;
                        color: #1e293b;
                        direction: rtl;
                    }
                    .container {
                        max-width: 700px;
                        margin: 0 auto;
                        border: 2px solid #0ea5e9;
                        border-radius: 16px;
                        padding: 32px;
                    }
                    h1 {
                        text-align: center;
                        color: #0ea5e9;
                        margin-bottom: 32px;
                    }
                    .info {
                        margin-bottom: 24px;
                        padding: 16px;
                        background: #f8fafc;
                        border-radius: 8px;
                    }
                    .result-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 16px;
                        padding: 12px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .label {
                        font-weight: 600;
                        color: #475569;
                    }
                    .value {
                        font-weight: 700;
                        color: #1e293b;
                    }
                    .status {
                        text-align: center;
                        padding: 16px;
                        border-radius: 8px;
                        margin-top: 24px;
                        font-weight: 700;
                    }
                    .status.success {
                        background: #10b981;
                        color: white;
                    }
                    .status.error {
                        background: #ef4444;
                        color: white;
                    }
                    .status.warning {
                        background: #f59e0b;
                        color: white;
                    }
                    .analysis-section {
                        margin-top: 24px;
                        padding: 16px;
                        background: #f8fafc;
                        border-radius: 8px;
                    }
                    .analysis-item {
                        margin-bottom: 16px;
                        padding: 12px;
                        background: white;
                        border-radius: 8px;
                        border-right: 4px solid;
                    }
                    .analysis-item.eligible { border-right-color: #10b981; }
                    .analysis-item.not-eligible { border-right-color: #ef4444; }
                    .analysis-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        font-weight: 600;
                    }
                    .badge {
                        background: #0ea5e9;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                    }
                    .analysis-details {
                        font-size: 14px;
                        color: #475569;
                    }
                    .status-badge {
                        margin-top: 8px;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 13px;
                    }
                    .status-badge.success { background: #10b98120; color: #10b981; }
                    .status-badge.error { background: #ef444420; color: #ef4444; }
                    .status-badge.warning { background: #f59e0b20; color: #f59e0b; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>گزارش محاسبه معدل</h1>
                    <div class="info">
                        <div class="result-row">
                            <span class="label">رشته تحصیلی:</span>
                            <span class="value">${discipline}</span>
                        </div>
                        <div class="result-row">
                            <span class="label">پایه تحصیلی:</span>
                            <span class="value">${grade}</span>
                        </div>
                        <div class="result-row">
                            <span class="label">معدل خرداد:</span>
                            <span class="value">${currentGPA}</span>
                        </div>
                        <div class="result-row">
                            <span class="label">معدل جدید:</span>
                            <span class="value">${newGPA}</span>
                        </div>
                    </div>
                    <div class="analysis-section">
                        <h3>تحلیل دقیق دروس</h3>
                        ${detailedAnalysis}
                    </div>
                    <div class="status ${statusTitle.includes('✅') ? 'success' : statusTitle.includes('⚠️') ? 'warning' : 'error'}">
                        ${statusTitle}
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }

    clearAll() {
        if (this.courses.length === 0) {
            this.showNotification('لیست درس‌ها خالی است', 'warning');
            return;
        }

        if (confirm('آیا از پاک کردن همه درس‌ها اطمینان دارید؟')) {
            this.courses.forEach(course => course.remove());
            this.courses = [];
            this.selectedCourses.clear();
            
            const emptyState = document.getElementById('empty-state');
            if (emptyState) {
                emptyState.style.display = 'flex';
            }
            
            this.updateCoursesCount();
            this.updateSummerStats();
            this.saveToLocalStorage();
            this.showNotification('همه درس‌ها پاک شدند', 'success');
        }
    }

    newCalculation() {
        if (confirm('آیا از ایجاد محاسبه جدید اطمینان دارید؟')) {
            this.courses.forEach(course => course.remove());
            this.courses = [];
            this.selectedCourses.clear();
            
            const emptyState = document.getElementById('empty-state');
            if (emptyState) {
                emptyState.style.display = 'flex';
            }
            
            const juneGPA = document.getElementById('june-gpa');
            const minGPA = document.getElementById('min-gpa');
            
            if (juneGPA) juneGPA.value = '';
            if (minGPA) minGPA.value = '12';
            
            const elements = ['current-gpa', 'new-gpa', 'summer-units', 'summer-in-person', 'summer-remote'];
            elements.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (id.includes('summer')) {
                        el.textContent = '۰';
                    } else {
                        el.textContent = '--';
                    }
                }
            });
            
            const statusContainer = document.getElementById('status-container');
            const statusIcon = document.getElementById('status-icon');
            const statusTitle = document.getElementById('status-title');
            const statusDescription = document.getElementById('status-description');
            const detailedAnalysis = document.getElementById('detailed-analysis');
            
            if (statusContainer) {
                const statusIconContainer = statusContainer.querySelector('.result-status-icon');
                if (statusIconContainer) {
                    statusIconContainer.className = 'result-status-icon';
                }
            }
            
            if (statusIcon) statusIcon.className = 'fas fa-info-circle';
            if (statusTitle) statusTitle.textContent = 'منتظر محاسبه';
            if (statusDescription) statusDescription.textContent = 'برای مشاهده نتایج، دکمه محاسبه را بزنید';
            if (detailedAnalysis) detailedAnalysis.innerHTML = '';
            
            this.updateCoursesCount();
            this.updateSummerStats();
            this.saveToLocalStorage();
            this.switchTab('academic-info');
            this.showNotification('فرم جدید آماده است', 'success');
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && !e.shiftKey && !e.altKey) {
                switch(e.key) {
                    case 'n':
                    case 'N':
                        e.preventDefault();
                        this.newCalculation();
                        break;
                    case 's':
                    case 'S':
                        e.preventDefault();
                        this.saveResult();
                        break;
                    case 'p':
                    case 'P':
                        e.preventDefault();
                        this.printResult();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextTab();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousTab();
                        break;
                }
            }
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-pane').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const targetTab = document.getElementById(`tab-${tabName}`);
        const targetNav = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        if (targetNav) {
            targetNav.classList.add('active');
        }

        this.currentTabIndex = this.tabs.indexOf(tabName);
    }

    previousTab() {
        if (this.currentTabIndex > 0) {
            this.currentTabIndex--;
            this.switchTab(this.tabs[this.currentTabIndex]);
        }
    }

    nextTab() {
        if (this.currentTabIndex < this.tabs.length - 1) {
            this.currentTabIndex++;
            this.switchTab(this.tabs[this.currentTabIndex]);
        }
    }

    toggleUnitsDisplay(show) {
        const unitsInputs = document.querySelectorAll('.course-units');
        unitsInputs.forEach(input => {
            if (input) {
                input.style.display = show ? 'block' : 'none';
            }
        });
    }

    toggleCompactMode(compact) {
        const coursesList = document.getElementById('courses-container');
        if (coursesList) {
            coursesList.style.maxHeight = compact ? '300px' : '600px';
        }
    }

    saveSettingsToStorage() {
        const settings = {
            showUnits: document.getElementById('show-units')?.checked || false,
            compactMode: document.getElementById('compact-mode')?.checked || false
        };
        Utils.saveToStorage('gpaCalculatorSettings', settings);
    }

    checkGradeSpecificRules() {
        const grade = document.getElementById('grade').value;
        const gradeSpecificRules = document.getElementById('grade-specific-rules');
        const statusDescription = document.getElementById('status-description');
        
        if (grade === 'دوازدهم') {
            if (gradeSpecificRules) {
                gradeSpecificRules.innerHTML = `
                    <div class="info-card" style="background: rgba(245, 158, 11, 0.1); border-color: #f59e0b;">
                        <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
                        <div>
                            <strong>پایه دوازدهم - امتحانات نهایی:</strong>
                            <ul style="margin-top: 8px; font-size: 13px; list-style: none; padding-right: 0;">
                                <li>✓ نمره برگه نهایی ≥ ۷ و نمره سالانه ≥ ۱۰ → قبول</li>
                                <li>✓ نمره برگه نهایی < ۷ و نمره سالانه ≥ ۱۰ → مشمول تک‌ماده</li>
                                <li>✓ نمره سالانه ۷ تا <۱۰ → مشمول تک‌ماده (در صورت داشتن شرایط)</li>
                                <li>⚠️ نمره سالانه < ۷ → مردود (نیاز به امتحان مجدد)</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        } else {
            if (gradeSpecificRules) {
                gradeSpecificRules.innerHTML = `
                    <div class="info-card" style="background: rgba(59, 130, 246, 0.1); border-color: #3b82f6;">
                        <i class="fas fa-info-circle" style="color: #3b82f6;"></i>
                        <div>
                            <strong>پایه‌های دهم و یازدهم:</strong>
                            <ul style="margin-top: 8px; font-size: 13px; list-style: none; padding-right: 0;">
                                <li>✓ نمره سالانه ≥ ۱۰ → قبول</li>
                                <li>✓ نمره سالانه ۷ تا <۱۰ → مشمول تک‌ماده (در صورت داشتن شرایط)</li>
                                <li>⚠️ نمره سالانه < ۷ → مردود (نیاز به امتحان مجدد)</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        }
        
        if (statusDescription) {
            statusDescription.textContent = grade === 'دوازدهم' ? 
                'پایه دوازدهم - قوانین خاص امتحانات نهایی اعمال می‌شود' : 
                'پایه‌های دهم و یازدهم - قوانین عادی اعمال می‌شود';
        }
    }

    resetDefaults() {
        if (confirm('آیا از بازنشانی به تنظیمات پیش‌فرض اطمینان دارید؟')) {
            localStorage.removeItem('gpaCalculatorData');
            localStorage.removeItem('gpaSavedResults');
            localStorage.removeItem('gpaCalculatorSettings');
            this.savedResults = [];
            this.newCalculation();
            
            const showUnits = document.getElementById('show-units');
            const compactMode = document.getElementById('compact-mode');
            if (showUnits) showUnits.checked = true;
            if (compactMode) compactMode.checked = false;
            this.toggleUnitsDisplay(true);
            this.toggleCompactMode(false);
            
            this.showNotification('تنظیمات به حالت پیش‌فرض بازگشت', 'success');
        }
    }

    exportData() {
        const exportData = {
            savedResults: this.savedResults,
            exportDate: new Date().toISOString(),
            version: '3.0.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `gpa-calculator-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('داده‌ها با موفقیت export شدند', 'success');
    }

    triggerImport() {
        const importFile = document.getElementById('import-file');
        if (importFile) {
            importFile.click();
        }
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (confirm(`آیا از وارد کردن اطلاعات اطمینان دارید؟`)) {
                    if (importedData.savedResults) {
                        this.savedResults = importedData.savedResults;
                        Utils.saveToStorage('gpaSavedResults', this.savedResults);
                    }
                    
                    this.showNotification('داده‌ها با موفقیت import شدند', 'success');
                }
            } catch (error) {
                this.showNotification('خطا در خواندن فایل', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    saveToLocalStorage() {
        const courseData = this.courses.map(course => ({
            name: course.querySelector('.course-name')?.value || '',
            units: course.querySelector('.course-units')?.value || '',
            attendanceType: course.querySelector('.attendance-type')?.value || 'in-person',
            summerFinal: course.querySelector('.summer-final')?.value || '',
            summerMonthly: course.querySelector('.summer-monthly')?.value || '',
            juneAnnual: course.querySelector('.june-annual')?.value || '',
            monthly1: course.querySelector('.monthly1')?.value || '',
            final1: course.querySelector('.final1')?.value || '',
            monthly2: course.querySelector('.monthly2')?.value || '',
            final2: course.querySelector('.final2')?.value || ''
        }));

        const data = {
            discipline: document.getElementById('discipline').value,
            grade: document.getElementById('grade').value,
            juneGPA: document.getElementById('june-gpa').value,
            minGPA: document.getElementById('min-gpa').value,
            courses: courseData,
            version: '3.0.0',
            lastSaved: new Date().toISOString()
        };
        
        Utils.saveToStorage('gpaCalculatorData', data);
    }

    loadFromLocalStorage() {
        try {
            const saved = Utils.loadFromStorage('gpaCalculatorData');
            if (saved) {
                const disciplineSelect = document.getElementById('discipline');
                const gradeSelect = document.getElementById('grade');
                const juneGPA = document.getElementById('june-gpa');
                const minGPA = document.getElementById('min-gpa');
                
                if (disciplineSelect && saved.discipline) {
                    disciplineSelect.value = saved.discipline;
                }
                
                if (gradeSelect && saved.grade) {
                    gradeSelect.value = saved.grade;
                }
                
                if (juneGPA && saved.juneGPA) {
                    juneGPA.value = saved.juneGPA;
                }
                
                if (minGPA && saved.minGPA) {
                    minGPA.value = saved.minGPA;
                }
                
                this.updateCourseList();
                this.checkGradeSpecificRules();
                
                if (saved.courses && saved.courses.length > 0) {
                    setTimeout(() => {
                        saved.courses.forEach(courseData => {
                            this.addCourse();
                            const lastCourse = this.courses[this.courses.length - 1];
                            if (lastCourse) {
                                const nameSelect = lastCourse.querySelector('.course-name');
                                const unitsInput = lastCourse.querySelector('.course-units');
                                const attendanceType = lastCourse.querySelector('.attendance-type');
                                const summerFinal = lastCourse.querySelector('.summer-final');
                                const summerMonthly = lastCourse.querySelector('.summer-monthly');
                                const juneAnnual = lastCourse.querySelector('.june-annual');
                                const monthly1 = lastCourse.querySelector('.monthly1');
                                const final1 = lastCourse.querySelector('.final1');
                                const monthly2 = lastCourse.querySelector('.monthly2');
                                const final2 = lastCourse.querySelector('.final2');
                                const courseBody = lastCourse.querySelector('.course-body');
                                
                                if (nameSelect) nameSelect.value = courseData.name;
                                if (unitsInput) unitsInput.value = courseData.units;
                                if (attendanceType) attendanceType.value = courseData.attendanceType;
                                if (summerFinal) summerFinal.value = courseData.summerFinal;
                                if (summerMonthly) summerMonthly.value = courseData.summerMonthly;
                                if (juneAnnual) juneAnnual.value = courseData.juneAnnual;
                                if (monthly1) monthly1.value = courseData.monthly1;
                                if (final1) final1.value = courseData.final1;
                                if (monthly2) monthly2.value = courseData.monthly2;
                                if (final2) final2.value = courseData.final2;
                                
                                this.calculateCourseSummerGrade(lastCourse);
                                
                                const monthlyField = lastCourse.querySelector('.attendance-monthly');
                                if (attendanceType && monthlyField && courseBody) {
                                    if (attendanceType.value === 'remote') {
                                        monthlyField.style.display = 'none';
                                        courseBody.classList.add('remote-layout');
                                    } else {
                                        monthlyField.style.display = 'block';
                                        courseBody.classList.remove('remote-layout');
                                    }
                                }
                            }
                        });
                        
                        this.refreshAllCourseDropdowns();
                    }, 100);
                }
            }
            
            const savedResults = Utils.loadFromStorage('gpaSavedResults', []);
            if (savedResults) {
                this.savedResults = savedResults;
            }
            
            const savedSettings = Utils.loadFromStorage('gpaCalculatorSettings');
            if (savedSettings) {
                const showUnits = document.getElementById('show-units');
                const compactMode = document.getElementById('compact-mode');
                if (showUnits && savedSettings.showUnits !== undefined) {
                    showUnits.checked = savedSettings.showUnits;
                    this.toggleUnitsDisplay(savedSettings.showUnits);
                }
                if (compactMode && savedSettings.compactMode !== undefined) {
                    compactMode.checked = savedSettings.compactMode;
                    this.toggleCompactMode(savedSettings.compactMode);
                }
            }
        } catch (error) {
            console.warn('خطا در بارگذاری داده‌ها:', error);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            });
        }
        
        container.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showHelp() {
        const helpMessage = `📚 راهنمای استفاده از سیستم محاسبه معدل هوشمند:

۱. اطلاعات تحصیلی:
   - رشته و پایه تحصیلی را انتخاب کنید
   - معدل خرداد و حداقل معدل مورد نیاز را وارد کنید

۲. دروس تابستانی:
   - با کلیک روی "افزودن درس جدید" درس مورد نظر را اضافه کنید
   - هر درس فقط یک بار قابل انتخاب است
   - نوع حضور (حضوری/غیرحضوری) را مشخص کنید
   - نمرات تابستان را وارد کنید

۳. نمرات خرداد هر درس:
   - می‌توانید مستقیماً "نمره سالانه" را وارد کنید
   - یا با کلیک روی "جزئیات نمرات خرداد" نمرات هر نوبت را وارد کنید
   - سیستم به صورت خودکار نمره سالانه را محاسبه می‌کند

۴. فرمول‌های محاسباتی:
   - نمره سالانه = (مستمر۱×۱ + پایانی۱×۲ + مستمر۲×۱ + پایانی۲×۴) ÷ ۸
   - نمره تابستانه حضوری = (پایانی×۳ + مستمر×۱) ÷ ۴
   - نمره تابستانه غیرحضوری = نمره پایانی
   - گرد کردن: ریاضی استاندارد تا ۲ رقم اعشار

۵. محدودیت‌ها:
   - حداکثر واحد مجاز تابستان: ۳۵ واحد
   - حداکثر واحد حضوری: ۱۰ واحد
   - حداکثر تعداد دروس مشمول تک‌ماده: ۴ درس
   - حداقل معدل برای تک‌ماده: ۱۰
   - حداقل نمره درس برای تک‌ماده: ۷

۶. نکات مهم:
   - دروس مهارتی مشمول تک‌ماده نمی‌شوند
   - پایه دوازدهم قوانین خاص امتحانات نهایی دارد

۷. کلیدهای میانبر:
   - Ctrl + N: محاسبه جدید
   - Ctrl + S: ذخیره نتیجه
   - Ctrl + P: چاپ نتیجه
   - Ctrl + →: تب بعدی
   - Ctrl + ←: تب قبلی

برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.`;
        
        alert(helpMessage);
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    window.gpaCalculator = new GPACalculator();
    console.log('🚀 محاسبه‌گر معدل پیشرفته نسخه ۳.۰ آماده به کار است');
});