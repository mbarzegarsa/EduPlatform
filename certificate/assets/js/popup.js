class ProfessionalCertificateSystem {
    constructor() {
        this.currentTab = 'document-type';
        this.currentDocumentType = 'certificate';
        this.studentImageUrl = null;
        this.uploadedImage = null;
        this.formData = {};
        this.defaultSettings = {};
        this.savedCertificates = [];
        this.autoSaveInterval = null;
        this.studentDatabase = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        this.loadDefaultSettings();
        this.loadFormData();
        this.loadSavedCertificates();
        this.loadStudentDatabase();
        this.initializeDatePickers();
        this.startAutoSave();
        this.setupKeyboardShortcuts();
        this.updateSystemStatus('سیستم آماده به کار');

        this.initMobileMenu();
        this.adjustForMobile();
        window.addEventListener('resize', () => this.adjustForMobile());
        
        console.log('✅ سامانه حرفه‌ای صدور گواهی و نامه راه‌اندازی شد');
    }

    // ========== متدهای ریسپانسیو موبایل ==========
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
    // ========== پایان متدهای ریسپانسیو ==========

    // ========== متدهای کمکی ==========

    downloadSampleExcelFile() {
        // ایجاد داده‌های نمونه
        const sampleData = [
            ['کد', 'نام', 'نام خانوادگی', 'نام پدر', 'تاریخ تولد', 'پایه', 'نام رشته'],
            ['0989898989', 'امیرعلی', 'آزادی', 'حسین', '13880310', 'یازدهم', 'علوم تجربی'],
        ];

        // ایجاد workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(sampleData);

        // تنظیم عرض ستون‌ها
        ws['!cols'] = [
            { wch: 15 }, // کد
            { wch: 12 }, // نام
            { wch: 20 }, // نام خانوادگی
            { wch: 12 }, // نام پدر
            { wch: 15 }, // تاریخ تولد
            { wch: 10 }, // پایه
            { wch: 18 }  // نام رشته
        ];

        // اضافه کردن sheet به workbook
        XLSX.utils.book_append_sheet(wb, ws, 'دانش‌آموزان');

        // دانلود فایل
        XLSX.writeFile(wb, 'sample-student-database.xlsx');
        
        this.showNotification('✅ فایل نمونه با موفقیت دانلود شد', 'success');
    }


    toPersianNumbers(input) {
        if (!input && input !== 0) return '';
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return input.toString().replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
    }

    normalizeNationalCode(code) {
        if (!code) return '';
        // حذف فاصله و کاراکترهای غیرعددی
        const cleaned = code.toString().replace(/\D/g, '');
        // اگر 9 رقمی بود، یک صفر به ابتدا اضافه کن
        if (cleaned.length === 9) {
            return '0' + cleaned;
        }
        // اگر 10 رقمی بود، همان را برگردان
        if (cleaned.length === 10) {
            return cleaned;
        }
        return cleaned;
    }

    getBirthCityFromNationalCode(nationalCode) {
        if (!nationalCode || nationalCode.length < 3) return '';
        
        const threeDigits = nationalCode.substring(0, 3);
        const firstTwoDigits = nationalCode.substring(0, 2);
        
        const cityMap = {
            '001': 'تهران مرکزی', '002': 'تهران مرکزی', '003': 'تهران مرکزی', '004': 'تهران مرکزی',
            '005': 'تهران مرکزی', '006': 'تهران مرکزی', '007': 'تهران مرکزی', '008': 'تهران مرکزی',
            '011': 'تهران جنوب', '015': 'تهران غرب', '020': 'تهران شرق', '025': 'تهران شمال',
            '031': 'کرج', '032': 'کرج', '037': 'قم', '038': 'قم',
            '041': 'ورامین', '042': 'ورامین', '043': 'دماوند', '044': 'شمیران',
            '045': 'شمیران', '048': 'شهرری', '049': 'شهرری',
            '051': 'آشتیان', '052': 'اراک', '053': 'اراک', '055': 'خمین',
            '056': 'محلات', '057': 'دلیجان', '058': 'تفرش', '059': 'ساوه',
            '060': 'ساوه', '061': 'سربند', '062': 'سربند',
            '063': 'اسفراین', '064': 'بیرجند', '065': 'بیرجند', '067': 'بجنورد',
            '068': 'بجنورد', '069': 'تربت حیدریه', '070': 'تربت حیدریه',
            '072': 'تربت جام', '073': 'تربت جام', '074': 'تایباد',
            '075': 'جاجرم', '076': 'خواف', '077': 'درگز', '078': 'سبزوار',
            '079': 'سبزوار', '081': 'سرخس', '082': 'شیروان', '083': 'طبس',
            '084': 'فریمان', '085': 'فردوس', '086': 'قوچان', '087': 'قوچان',
            '088': 'قائنات', '089': 'کاشمر', '090': 'کاشمر', '091': 'گناباد',
            '092': 'مشهد', '093': 'مشهد', '094': 'مشهد', '096': 'مشهد منطقه1',
            '097': 'مشهد منطقه2', '098': 'مشهد منطقه3',
            '105': 'نیشابور', '106': 'نیشابور',
            '108': 'نجف آباد', '109': 'نجف آباد', '110': 'فلاورجان', '111': 'فلاورجان',
            '112': 'فریدونشهر', '113': 'خمینی شهر', '114': 'خمینی شهر', '115': 'فریدن',
            '116': 'لنجان', '117': 'لنجان', '118': 'اردستان', '119': 'شهرضا',
            '120': 'سمیرم', '121': 'گلپایگان', '122': 'خوانسار', '123': 'نطنز',
            '124': 'نائین', '125': 'کاشان', '126': 'کاشان', '127': 'اصفهان',
            '128': 'اصفهان', '129': 'اصفهان',
            '136': 'تبریز', '137': 'تبریز', '138': 'تبریز',
            '145': 'اردبیل', '146': 'اردبیل',
            '149': 'اهر', '150': 'اهر',
            '152': 'میانه', '153': 'میانه',
            '154': 'مراغه', '155': 'مراغه',
            '158': 'مرند',
            '159': 'هشترود', '160': 'هشترود',
            '161': 'مغان', '162': 'مغان', '163': 'خلخال',
            '164': 'سراب', '165': 'سراب',
            '166': 'مشکین شهر', '167': 'مشکین شهر',
            '168': 'بناب', '169': 'آذرشهر', '170': 'اسکو', '171': 'بستان آباد',
            '172': 'شبستر', '173': 'هریس',
            '174': 'اهواز', '175': 'اهواز',
            '181': 'آبادان', '182': 'خرمشهر', '183': 'ایذه', '184': 'ایذه',
            '185': 'بهبهان', '186': 'بهبهان', '187': 'شوشتر', '188': 'شوشتر',
            '189': 'شادگان', '190': 'رامهرمز', '191': 'رامهرمز', '192': 'اندیمشک',
            '193': 'اندیمشک', '194': 'بندرماهشهر', '195': 'بندرماهشهر', '196': 'مسجدسلیمان',
            '197': 'مسجدسلیمان', '198': 'دشت آزادگان', '199': 'دزفول', '200': 'دزفول',
            '202': 'گنبد کاووس', '203': 'گنبد کاووس',
            '205': 'بابل', '206': 'بابل',
            '208': 'ساری', '209': 'ساری',
            '211': 'گرگان', '212': 'گرگان',
            '213': 'آمل', '214': 'آمل',
            '215': 'قائمشهر', '216': 'قائمشهر',
            '217': 'بهشهر', '218': 'بهشهر',
            '219': 'نوشهر', '220': 'نوشهر',
            '221': 'تنکابن', '222': 'نور', '223': 'بندرترکمن',
            '224': 'کردکوی', '225': 'سوادکوه', '226': 'علی آباد', '227': 'رامسر',
            '228': 'شیراز', '229': 'شیراز', '230': 'شیراز',
            '236': 'کازرون', '237': 'کازرون',
            '238': 'ممسنی', '239': 'ممسنی',
            '240': 'آباده', '241': 'آباده',
            '242': 'مرودشت', '243': 'مرودشت',
            '244': 'فیروزآباد', '245': 'فیروزآباد',
            '246': 'جهرم', '247': 'جهرم',
            '248': 'داراب', '249': 'داراب',
            '250': 'لارستان', '251': 'لارستان',
            '252': 'استهبان', '253': 'اقلید', '254': 'سپیدان', '255': 'نی ریز',
            '256': 'فسا', '257': 'فسا',
            '258': 'رشت', '259': 'رشت',
            '261': 'آستارا', '262': 'طالش', '263': 'طالش', '264': 'بندرانزلی',
            '265': 'رودبار', '266': 'فومن', '267': 'صومعه سرا', '268': 'رودسر',
            '269': 'رودسر', '270': 'لنگرود', '271': 'لاهیجان', '272': 'لاهیجان',
            '273': 'آستانه',
            '274': 'ارومیه', '275': 'ارومیه',
            '279': 'خوی', '280': 'خوی',
            '282': 'ماکو', '283': 'ماکو',
            '284': 'سلماس', '285': 'سلماس',
            '286': 'مهاباد', '287': 'مهاباد',
            '288': 'سردشت', '289': 'پیرانشهر', '290': 'نقده',
            '291': 'سیه چشمه', '292': 'بوکان', '293': 'شاهین دژ', '294': 'تکاب',
            '295': 'اشنویه',
            '296': 'میاندوآب', '297': 'میاندوآب',
            '298': 'کرمان', '299': 'کرمان',
            '302': 'جیرفت', '303': 'جیرفت',
            '304': 'رفسنجان', '305': 'رفسنجان',
            '306': 'سیرجان', '307': 'سیرجان',
            '308': 'زرند', '309': 'زرند',
            '310': 'بم', '311': 'بم',
            '312': 'بافت', '313': 'بافت', '314': 'شهربابک',
            '315': 'کهنوج', '316': 'کهنوج',
            '317': 'بردسیر', '318': 'گلباف', '319': 'شهداد', '320': 'فهرج',
            '321': 'راور', '322': 'پاوه', '323': 'پاوه',
            '324': 'کرمانشاه', '325': 'کرمانشاه',
            '330': 'کنگاور', '331': 'هرسین', '332': 'گیلانغرب',
            '333': 'اسلام آباد', '334': 'اسلام آباد',
            '335': 'سنقر', '336': 'سرپل ذهاب', '337': 'قصرشیرین',
            '338': 'بندرعباس', '339': 'بندرعباس',
            '341': 'میناب', '342': 'میناب',
            '343': 'بندرلنگه', '344': 'بندرلنگه',
            '345': 'قشم', '346': 'جاسک', '347': 'حاجی آباد', '348': 'بستک',
            '349': 'بوشهر', '350': 'بوشهر',
            '351': 'دشتستان', '352': 'دشتستان',
            '353': 'بندر گناوه', '354': 'دشتی', '355': 'تنگستان',
            '356': 'کنگان', '357': 'دیر',
            '358': 'ایرانشهر', '359': 'ایرانشهر',
            '361': 'زاهدان', '362': 'زاهدان',
            '364': 'چابهار', '365': 'چابهار',
            '366': 'زابل', '367': 'زابل',
            '369': 'سراوان', '370': 'سراوان',
            '371': 'خاش',
            '372': 'سنندج', '373': 'سنندج',
            '375': 'سقز', '376': 'سقز',
            '377': 'بیجار', '378': 'بیجار',
            '379': 'قروه', '380': 'قروه',
            '381': 'مریوان', '382': 'مریوان',
            '383': 'کامیاران', '384': 'بانه', '385': 'دیواندره',
            '386': 'همدان', '387': 'همدان',
            '392': 'ملایر', '393': 'ملایر',
            '394': 'کرند', '395': 'نهاوند', '396': 'نهاوند',
            '397': 'تویسرکان', '398': 'رزن', '399': 'رزن',
            '400': 'اسدآباد', '401': 'اسدآباد',
            '402': 'کبودرآهنگ', '403': 'کبودرآهنگ',
            '404': 'بهار', '405': 'بهار',
            '406': 'خرم آباد', '407': 'خرم آباد',
            '412': 'بروجرد', '413': 'بروجرد',
            '416': 'الیگودرز', '417': 'الیگودرز',
            '418': 'الشتر', '419': 'کوهدشت', '420': 'نورآباد', '421': 'دورود',
            '422': 'بویراحمد', '423': 'بویراحمد',
            '424': 'کهکیلویه', '425': 'کهکیلویه',
            '426': 'گچساران',
            '431': 'قزوین', '432': 'قزوین',
            '438': 'تاکستان', '439': 'تاکستان',
            '442': 'یزد', '443': 'یزد',
            '444': 'اردکان', '445': 'تفت', '446': 'مهریز',
            '447': 'بافق', '448': 'میبد',
            '449': 'ایلام', '450': 'ایلام',
            '451': 'دهلران', '452': 'مهران', '453': 'شیروان و چرداول',
            '454': 'آبدانان', '455': 'دره شهر',
            '456': 'سمنان', '457': 'دامغان',
            '458': 'شاهرود', '459': 'شاهرود',
            '460': 'گرمسار',
            '461': 'شهرکرد', '462': 'شهرکرد',
            '465': 'بروجن', '466': 'لردگان', '467': 'فارسان', '468': 'اردل',
            '469': 'رودان', '470': 'گاوبندی',
            '471': 'امور خارجه', '472': 'امور خارجه',
            '481': 'باغ ملک',
            '483': 'ازنا', '484': 'ازنا',
            '486': 'کلاله', '487': 'رامیان', '488': 'مینودشت',
            '489': 'ساوجبلاغ',
            '490': 'شهریار', '491': 'شهریار',
            '492': 'پلدشت', '493': 'چایپاره',
            '496': 'صحنه',
            '497': 'آق قلا', '498': 'بابلسر', '499': 'نکاء',
            '500': 'هراز و محمودآباد', '501': 'هراز و محمودآباد',
            '502': 'فامنین',
            '503': 'ابرکوه',
            '504': 'پارس آباد',
            '505': 'جلفا',
            '506': 'عجب شیر',
            '507': 'ملکان',
            '508': 'آبیک',
            '509': 'بوئین زهرا',
            '510': 'شاهین شهر', '511': 'شاهین شهر',
            '512': 'سمیرم سفلی',
            '513': 'بوانات',
            '514': 'سروستان',
            '515': 'لامرد',
            '516': 'ماسال و شاندرمن',
            '517': 'سیاهکل',
            '518': 'خمام',
            '519': 'کلیبر',
            '520': 'میامی',
            '521': 'جغتای',
            '522': 'چناران',
            '523': 'درمیان',
            '524': 'مانه و سملقان',
            '525': 'نیک شهر',
            '526': 'شوش',
            '527': 'آغاجاری',
            '528': 'ویسیان',
            '529': 'بندر دیلم',
            '530': 'مهدیشهر',
            '531': 'مراوه تپه',
            '532': 'سعد آباد',
            '533': 'زهک',
            '534': 'بدره',
            '535': 'کوهبنان',
            '536': 'رودبار کهنوج',
            '537': 'فین',
            '538': 'آوج',
            '540': 'خور و بیابانک',
            '541': 'مبارکه',
            '542': 'انار',
            '543': 'هرات و مروست',
            '544': 'فراهان',
            '545': 'ترکمانچای',
            '546': 'بیضا',
            '547': 'خشت و کمارج',
            '548': 'خرامه',
            '549': 'تیران و کرون',
            '550': 'لنده',
            '551': 'اشکذر',
            '552': 'نیر',
            '553': 'کلات',
            '554': 'خمیر',
            '555': 'کوهرنگ',
            '556': 'اسلامشهر',
            '557': 'اشترینان',
            '558': 'دهگلان',
            '559': 'ضیاءآباد',
            '561': 'بهاباد',
            '562': 'بجستان',
            '563': 'نهبندان',
            '564': 'جرقویه',
            '565': 'کوهپایه',
            '566': 'کوثر',
            '567': 'ورزقان',
            '568': 'بندپی',
            '569': 'شفت',
            '570': 'رضوانشهر',
            '571': 'وفس',
            '572': 'بردسکن',
            '573': 'جوین',
            '574': 'زبرخان',
            '575': 'چادگان',
            '576': 'چهاردانگه',
            '577': 'شیرگاه',
            '578': 'دودانگه',
            '579': 'گلوگاه',
            '580': 'رودبار الموت',
            '581': 'ملکشاهی',
            '582': 'جویبار',
            '583': 'رابر',
            '584': 'قلقل رود',
            '585': 'اروندکنار',
            '586': 'بشاگرد',
            '588': 'طارم سفلی',
            '590': 'رودبار شهرستان',
            '591': 'رازوجرکلان',
            '592': 'پاپی',
            '593': 'عمارلو',
            '594': 'هندودر',
            '595': 'ثلاث باباجانی',
            '596': 'روانسر',
            '597': 'لاشار',
            '598': 'رومشکان',
            '599': 'بهمنی',
            '600': 'چاروسا',
            '601': 'بیله سوار',
            '603': 'نیر',
            '604': 'هوراند',
            '605': 'ریگان',
            '606': 'عنبرآباد',
            '607': 'ماهان',
            '608': 'منوجان',
            '609': 'جم',
            '610': 'شبانکاره',
            '611': 'میرجاوه',
            '612': 'چغلوندی',
            '613': 'چگنی',
            '615': 'ابهر و خرمدره',
            '616': 'ایوان',
            '617': 'خنداب',
            '618': 'زرند مرکزی',
            '619': 'آران و بیدگل',
            '620': 'باغ بهادران',
            '621': 'بوئین و میاندشت',
            '622': 'میمه',
            '623': 'صوفیان',
            '624': 'آزادشهر',
            '625': 'چمستان',
            '626': 'کجور',
            '627': 'کلاردشت',
            '628': 'گمیشان',
            '629': 'گندمان',
            '630': 'املش',
            '631': 'رحیم آباد',
            '632': 'فلارد',
            '633': 'کیار',
            '634': 'شیروان لومار',
            '635': 'فاروج',
            '636': 'چاروایماق',
            '637': 'انزل',
            '638': 'سیلوانه',
            '640': 'شوط',
            '641': 'حمیل',
            '642': 'بیارجمند',
            '643': 'احمدآباد',
            '644': 'تخت جلگه',
            '646': 'سروآباد',
            '647': 'شراء و پیشخوار',
            '648': 'ارسنجان',
            '649': 'اوز',
            '650': 'رشتخوار',
            '651': 'فیض آباد',
            '652': 'زیرکوه',
            '653': 'سنگر',
            '654': 'حاجی آباد (زرین دشت)',
            '655': 'خفر',
            '656': 'کراش',
            '657': 'مهر',
            '658': 'پاکدشت',
            '659': 'فیروزکوه',
            '660': 'دولت آباد',
            '661': 'هندیجان',
            '662': 'رامشیر',
            '663': 'اندیکا',
            '664': 'کهریزک',
            '665': 'سعادت آباد',
            '666': 'رباط کریم',
            '667': 'ابوموسی',
            '668': 'سیب و سوران',
            '669': 'فنوج',
            '670': 'آباده طشک',
            '671': 'جویم',
            '673': 'شیبکوه',
            '674': 'کرانی',
            '675': 'کشاورز',
            '676': 'نمشیر',
            '677': 'تخت سلیمان',
            '678': 'اشکنان',
            '679': 'فراشبند',
            '680': 'هویزه',
            '681': 'قنقری (خرم بید)',
            '682': 'بزمان',
            '683': 'کوار',
            '684': 'ایوانکی',
            '685': 'امیدیه',
            '686': 'نمین',
            '687': 'باشت',
            '688': 'دروهان',
            '689': 'بندرگز',
            '690': 'انگوت',
            '691': 'باینگان',
            '692': 'سردشت (خوزستان)',
            '693': 'کوچصفهان',
            '694': 'لشت نشاء',
            '695': 'طالقان',
            '696': 'میانکوه',
            '697': 'مارگون',
            '698': 'قلعه گنج',
            '699': 'قصرقند',
            '700': 'بسطام',
            '701': 'دشتیاری',
            '702': 'کهک',
            '703': 'بمپور',
            '704': 'زابلی',
            '705': 'شیب آب',
            '706': 'بندر امام خمینی',
            '707': 'شاوور',
            '711': 'بندپی شرقی',
            '712': 'عباس آباد',
            '713': 'میاندورود',
            '714': 'خورش رستم',
            '715': 'سرعین',
            '716': 'سربیشه',
            '717': 'نظرآباد',
            '718': 'دستگردان',
            '719': 'سرایان',
            '720': 'راسک',
            '721': 'بشرویه',
            '722': 'ارزونیه',
            '723': 'قیروکارزین',
            '724': 'خلیل آباد',
            '725': 'کنارک',
            '726': 'زرین آباد',
            '727': 'موسیان',
            '728': 'البرز',
            '729': 'گتوند',
            '730': 'لالی',
            '731': 'ارشق',
            '732': 'دلوار'
        };
        
        return cityMap[threeDigits] || cityMap[firstTwoDigits] || '';
    }

    // ========== متدهای مدیریت پایگاه داده دانش‌آموزان ==========

    async uploadExcelFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const headers = jsonData[0];
                const rows = jsonData.slice(1);
                
                this.studentDatabase = rows.map(row => {
                    const student = {};
                    headers.forEach((header, index) => {
                        let value = row[index] ? row[index].toString().trim() : '';
                        
                        switch(header) {
                            case 'کد':
                                student.nationalCode = this.normalizeNationalCode(value);
                                break;
                            case 'نام':
                                student.firstName = value;
                                break;
                            case 'نام خانوادگی':
                                student.lastName = value;
                                break;
                            case 'نام پدر':
                                student.fatherName = value;
                                break;
                            case 'تاریخ تولد':
                                student.birthDate = this.formatExcelDate(value);
                                break;
                            case 'پایه':
                                student.grade = value;
                                break;
                            case 'نام رشته':
                                student.field = value;
                                break;
                        }
                    });
                    
                    student.studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
                    
                    // پر کردن خودکار شهر محل صدور بر اساس کد ملی
                    if (student.nationalCode && !student.birthCity) {
                        student.birthCity = this.getBirthCityFromNationalCode(student.nationalCode);
                    }
                    
                    return student;
                }).filter(student => student.nationalCode);
                
                localStorage.setItem('studentDatabase', JSON.stringify(this.studentDatabase));
                this.updateStudentDatabaseStats();
                this.showNotification(`✅ فایل اکسل با موفقیت بارگذاری شد. تعداد ${this.toPersianNumbers(this.studentDatabase.length)} دانش‌آموز افزوده شد.`, 'success');
                
            } catch (error) {
                console.error('خطا در پردازش فایل اکسل:', error);
                this.showNotification('❌ خطا در پردازش فایل اکسل. لطفاً از فرمت صحیح فایل اطمینان حاصل کنید.', 'error');
            }
        };
        reader.readAsBinaryString(file);
    }

    formatExcelDate(dateValue) {
        if (!dateValue) return '';
        
        if (typeof dateValue === 'number') {
            const excelEpoch = new Date(1900, 0, 1);
            const date = new Date(excelEpoch.getTime() + (dateValue - 1) * 24 * 60 * 60 * 1000);
            const persianDate = this.gregorianToJalali(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate()
            );
            return `${persianDate[0]}/${this.formatMonth(persianDate[1])}/${this.formatMonth(persianDate[2])}`;
        }
        
        const dateStr = dateValue.toString();
        
        if (/^\d{8}$/.test(dateStr)) {
            return `${dateStr.substr(0,4)}/${dateStr.substr(4,2)}/${dateStr.substr(6,2)}`;
        }
        
        if (dateStr.includes('/')) {
            return dateStr;
        }
        
        return dateStr;
    }

    searchStudentByNationalCode() {
        const inputCode = document.getElementById('nationalCode').value.trim();
        const normalizedCode = this.normalizeNationalCode(inputCode);
        
        if (!normalizedCode) {
            this.showNotification('لطفاً کد ملی را وارد کنید', 'warning');
            return;
        }
        
        if (normalizedCode.length !== 10) {
            this.showNotification('کد ملی باید ۱۰ رقم باشد (ممکن است با صفر شروع شود)', 'error');
            return;
        }
        
        // به روز رسانی فیلد کد ملی با فرمت نرمال شده
        document.getElementById('nationalCode').value = normalizedCode;
        
        const student = this.studentDatabase.find(s => s.nationalCode === normalizedCode);
        
        if (student) {
            this.fillStudentData(student);
            this.showNotification(`✅ اطلاعات دانش‌آموز ${student.studentName} یافت شد و در فرم قرار گرفت.`, 'success');
        } else {
            this.showNotification('❌ دانش‌آموزی با این کد ملی در پایگاه داده یافت نشد.', 'warning');
        }
    }

    fillStudentData(student) {
        document.getElementById('studentName').value = student.studentName || '';
        document.getElementById('fatherName').value = student.fatherName || '';
        
        // پر کردن شهر محل صدور (اگر در اکسل نبود، از کد ملی استخراج می‌شود)
        const birthCity = student.birthCity || this.getBirthCityFromNationalCode(student.nationalCode);
        document.getElementById('birthCity').value = birthCity || '';
        
        document.getElementById('birthDate').value = student.birthDate || '';
        document.getElementById('grade').value = student.grade || '';
        
        const fieldSelect = document.getElementById('field');
        if (['دهم', 'یازدهم', 'دوازدهم'].includes(student.grade)) {
            fieldSelect.value = student.field || '';
            fieldSelect.disabled = false;
        } else {
            fieldSelect.value = '';
            fieldSelect.disabled = true;
        }
        
        this.saveFormData();
        this.saveToLocalStorage();
        
        if (this.currentTab === 'preview') {
            this.updatePreview();
        }
    }

    updateStudentDatabaseStats() {
        const statsElement = document.getElementById('studentDbStats');
        if (statsElement) {
            statsElement.innerHTML = `
                <div class="stat-card mini">
                    <div class="stat-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-number">${this.toPersianNumbers(this.studentDatabase.length)}</div>
                        <div class="stat-label">دانش‌آموز در پایگاه داده</div>
                    </div>
                </div>
            `;
        }
    }

    loadStudentDatabase() {
        try {
            const saved = localStorage.getItem('studentDatabase');
            if (saved) {
                this.studentDatabase = JSON.parse(saved);
                this.updateStudentDatabaseStats();
                console.log(`✅ ${this.studentDatabase.length} دانش‌آموز از حافظه محلی بارگذاری شد.`);
            }
        } catch (error) {
            console.warn('خطا در بارگذاری پایگاه داده دانش‌آموزان:', error);
        }
    }

    clearStudentDatabase() {
        if (confirm('آیا از پاک کردن تمام اطلاعات دانش‌آموزان از حافظه اطمینان دارید؟')) {
            this.studentDatabase = [];
            localStorage.removeItem('studentDatabase');
            this.updateStudentDatabaseStats();
            this.showNotification('✅ پایگاه داده دانش‌آموزان پاک شد.', 'success');
        }
    }

    // ========== ادامه متدهای اصلی (بقیه متدها مثل قبل باقی می‌مانند) ==========

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
                this.saveToLocalStorage();
            });
        });
        
document.getElementById('homeBtn')?.addEventListener('click', () => window.location.href = '../index.html');

        document.getElementById('downloadSampleExcelBtn').addEventListener('click', () => {this.downloadSampleExcelFile();});

        document.getElementById('prevTabBtn').addEventListener('click', () => this.previousTab());
        document.getElementById('nextTabBtn').addEventListener('click', () => this.nextTab());

        document.querySelectorAll('.document-type-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.getAttribute('data-document-type');
                this.changeDocumentType(type);
            });
        });

        document.getElementById('fetchImageBtn').addEventListener('click', () => this.fetchStudentImage());
        document.getElementById('uploadImageBtn').addEventListener('click', () => this.triggerImageUpload());
        document.getElementById('removeImageBtn').addEventListener('click', () => this.removeImage());
        document.getElementById('imageUpload').addEventListener('change', (e) => this.handleImageUpload(e));

        document.getElementById('newCertificateBtn').addEventListener('click', () => this.newCertificate());
        document.getElementById('printBtn').addEventListener('click', () => this.printCertificate());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('saveCertificateBtn').addEventListener('click', () => this.saveCurrentCertificate());

        document.getElementById('saveDefaultsBtn').addEventListener('click', () => this.saveDefaultSettings());
        document.getElementById('loadDefaultsBtn').addEventListener('click', () => this.loadDefaultSettingsToForm());
        document.getElementById('clearDefaultsBtn').addEventListener('click', () => this.clearDefaultSettings());
        
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => this.triggerImport());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
        document.getElementById('searchInput').addEventListener('input', () => this.filterCertificates());
        document.getElementById('documentTypeFilter').addEventListener('change', () => this.filterCertificates());
        document.getElementById('printTemplate').addEventListener('change', () => this.updatePreview());

        document.getElementById('uploadExcelBtn').addEventListener('click', () => {
            document.getElementById('excelFile').click();
        });

        document.getElementById('excelFile').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.uploadExcelFile(e.target.files[0]);
            }
            e.target.value = '';
        });

        document.getElementById('searchStudentBtn').addEventListener('click', () => {
            this.searchStudentByNationalCode();
        });

        document.getElementById('clearDatabaseBtn').addEventListener('click', () => {
            this.clearStudentDatabase();
        });

        document.getElementById('nationalCode').addEventListener('blur', () => this.validateNationalCode());
        document.getElementById('academicYear').addEventListener('blur', () => this.validateAcademicYear());

        document.getElementById('nationalCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchStudentByNationalCode();
            }
        });

        document.getElementById('grade').addEventListener('change', (e) => {
            this.updateFieldBasedOnGrade(e.target.value);
            this.saveFormData();
            this.saveToLocalStorage();
            this.updatePreview();
        });

        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id !== 'birthDate' && input.id !== 'documentDate' && input.id !== 'studyStartDate') {
                input.addEventListener('input', () => {
                    this.saveFormData();
                    this.saveToLocalStorage();
                    if (this.currentTab === 'preview') {
                        this.updatePreview();
                    }
                });
            }
        });

        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => {
                this.saveFormData();
                this.saveToLocalStorage();
                if (this.currentTab === 'preview') {
                    this.updatePreview();
                }
            });
        });

        // ========== دکمه‌های موبایل در فوتر ==========
        const mobileHomeBtn = document.getElementById('mobileHomeBtn');
        const mobileHelpBtn = document.getElementById('mobileHelpBtn');
        const mobileNewCertificateBtn = document.getElementById('mobileNewCertificateBtn');

        if (mobileHomeBtn) mobileHomeBtn.addEventListener('click', () => window.location.href = '../index.html');
        if (mobileHelpBtn) mobileHelpBtn.addEventListener('click', () => this.showHelp());
        if (mobileNewCertificateBtn) mobileNewCertificateBtn.addEventListener('click', () => this.newCertificate());
        // ========== پایان دکمه‌های موبایل ==========
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveCurrentCertificate();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.printCertificate();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newCertificate();
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

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveFormData();
            this.saveToLocalStorage();
        }, 30000);
    }

    setupTabNavigation() {
        const tabs = ['document-type', 'student-info', 'school-info', 'academic-info', 'document-info', 'military-info', 'preview', 'certificate-history', 'settings'];
        this.currentTabIndex = 0;
        this.tabs = tabs;
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        this.currentTab = tabName;
        this.currentTabIndex = this.tabs.indexOf(tabName);
        this.updateNavigationButtons();

        if (tabName === 'preview') {
            this.updatePreview();
        } else if (tabName === 'certificate-history') {
            this.updateCertificateHistory();
            this.updateStats();
        }
    }

    previousTab() {
        if (this.currentTabIndex > 0) {
            this.currentTabIndex--;
            this.switchTab(this.tabs[this.currentTabIndex]);
            this.saveToLocalStorage();
        }
    }

    nextTab() {
        if (this.currentTabIndex < this.tabs.length - 1) {
            if (this.validateCurrentTab()) {
                this.currentTabIndex++;
                this.switchTab(this.tabs[this.currentTabIndex]);
                this.saveToLocalStorage();
            }
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevTabBtn');
        const nextBtn = document.getElementById('nextTabBtn');
        const contentFooter = document.getElementById('contentFooter');

        if (this.currentTab === 'preview' || this.currentTab === 'certificate-history' || this.currentTab === 'settings') {
            contentFooter.style.display = 'none';
        } else {
            contentFooter.style.display = 'flex';
            
            prevBtn.disabled = this.currentTabIndex === 0;
            
            if (this.currentTabIndex === this.tabs.length - 4) {
                nextBtn.innerHTML = `پیش‌نمایش <i class="fas fa-arrow-left"></i>`;
            } else {
                nextBtn.innerHTML = `بعدی <i class="fas fa-arrow-left"></i>`;
            }
        }
    }

    validateCurrentTab() {
        const tab = this.currentTab;
        const data = this.getFormData();

        if (tab === 'student-info') {
            if (!data.nationalCode || !data.studentName || !data.fatherName || 
                !data.birthCity || !data.birthDate) {
                this.showNotification('لطفاً تمام اطلاعات ضروری دانش‌آموز را تکمیل کنید', 'error');
                return false;
            }
            
            if (!this.validateNationalCode()) {
                return false;
            }
        } else if (tab === 'school-info') {
            if (!data.provinceCode || !data.areaCode || !data.schoolCode || !data.schoolCity) {
                this.showNotification('لطفاً کدهای آموزشگاه و شهر آموزشگاه را وارد کنید', 'error');
                return false;
            }
        } else if (tab === 'academic-info') {
            if (!data.grade || !data.schoolName || !data.managerName || !data.academicYear) {
                this.showNotification('لطفاً اطلاعات تحصیلی ضروری را تکمیل کنید', 'error');
                return false;
            }
            
            if (!this.validateAcademicYear()) {
                return false;
            }
        } else if (tab === 'document-info') {
            if (!data.documentNumber || !data.documentDate) {
                this.showNotification('لطفاً شماره و تاریخ سند را وارد کنید', 'error');
                return false;
            }
        } else if (tab === 'military-info' && this.currentDocumentType === 'letter') {
            if (!data.militaryCity || !data.studyStartDate) {
                this.showNotification('لطفاً اطلاعات ضروری نظام وظیفه را تکمیل کنید', 'error');
                return false;
            }
        }

        return true;
    }

    changeDocumentType(type) {
        this.currentDocumentType = type;
        this.updateDocumentTypeUI();
        this.updatePreview();
        this.saveToLocalStorage();
    }

    updateDocumentTypeUI() {
        document.querySelectorAll('.document-type-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.documentType === this.currentDocumentType) {
                card.classList.add('active');
            }
        });
        
        const militaryInfoTab = document.getElementById('militaryInfoTab');
        
        if (this.currentDocumentType === 'letter') {
            militaryInfoTab.style.display = 'flex';
            if (!this.tabs.includes('military-info')) {
                this.tabs.splice(5, 0, 'military-info');
            }
        } else {
            militaryInfoTab.style.display = 'none';
            const index = this.tabs.indexOf('military-info');
            if (index > -1) {
                this.tabs.splice(index, 1);
            }
            
            if (this.currentTab === 'military-info') {
                this.switchTab('document-info');
            }
        }
        
        const headerTitle = document.querySelector('.header-title h1');
        const headerDescription = document.querySelector('.header-title p');
        
        if (this.currentDocumentType === 'certificate') {
            headerTitle.innerHTML = '<i class="fas fa-file-certificate"></i> سیستم صدور گواهی تحصیلی';
            headerDescription.textContent = 'سامانه پیشرفته مدیریت و صدور گواهی‌های تحصیلی';
        } else {
            headerTitle.innerHTML = '<i class="fas fa-envelope-open-text"></i> سیستم صدور نامه معافیت تحصیلی';
            headerDescription.textContent = 'سامانه تخصصی صدور نامه‌های معافیت تحصیلی';
        }
    }

    initializeDatePickers() {
        this.initializePersianDatePicker('birthDate');
        this.initializePersianDatePicker('documentDate');
        this.initializePersianDatePicker('studyStartDate');
    }

    initializePersianDatePicker(elementId) {
        const input = document.getElementById(elementId);
        if (!input) return;

        $(`#${elementId}`).persianDatepicker({
            format: 'YYYY/MM/DD',
            initialValue: false,
            autoClose: true,
            position: "auto",
            observer: true,
            calendar: {
                persian: {
                    locale: 'fa',
                    showHint: true
                }
            },
            onSelect: (unixDate) => {
                this.saveFormData();
                this.saveToLocalStorage();
                if (this.currentTab === 'preview') {
                    this.updatePreview();
                }
            }
        });
    }

    validateNationalCode() {
        const nationalCodeInput = document.getElementById('nationalCode');
        const rawValue = nationalCodeInput.value.trim();
        const normalizedCode = this.normalizeNationalCode(rawValue);
        
        if (!normalizedCode) {
            this.showNotification('لطفاً کد ملی را وارد کنید', 'warning');
            nationalCodeInput.focus();
            return false;
        }
        
        if (normalizedCode.length !== 10) {
            this.showNotification('کد ملی باید ۱۰ رقم باشد', 'error');
            nationalCodeInput.focus();
            return false;
        }
        
        const allSame = /^(\d)\1{9}$/.test(normalizedCode);
        if (allSame) {
            this.showNotification('کد ملی معتبر نیست', 'error');
            nationalCodeInput.focus();
            return false;
        }
        
        let yy = 0;
        for (let i = 0; i < 9; i++) {
            yy += parseInt(normalizedCode[i]) * (10 - i);
        }
        
        const remainder = yy % 11;
        let isValid = false;
        
        if (remainder < 2) {
            isValid = parseInt(normalizedCode[9]) === remainder;
        } else {
            isValid = parseInt(normalizedCode[9]) === (11 - remainder);
        }
        
        if (isValid) {
            this.showNotification('کد ملی معتبر است', 'success');
            return true;
        } else {
            this.showNotification('کد ملی معتبر نیست', 'error');
            nationalCodeInput.focus();
            return false;
        }
    }

    validateAcademicYear() {
        const academicYearInput = document.getElementById('academicYear');
        const value = academicYearInput.value.trim();
        
        if (value === "") {
            return false;
        }
        
        const pattern = /^14\d{2}-14\d{2}$/;
        if (!pattern.test(value)) {
            this.showNotification('فرمت سال تحصیلی صحیح نیست (مثال: 1404-1405)', 'error');
            academicYearInput.focus();
            return false;
        }
        
        const years = value.split('-');
        if (parseInt(years[1]) - parseInt(years[0]) !== 1) {
            this.showNotification('سال تحصیلی باید دو سال متوالی باشد (مثال: 1404-1405)', 'error');
            academicYearInput.focus();
            return false;
        }
        
        return true;
    }

    updateFieldBasedOnGrade(grade) {
        const fieldSelect = document.getElementById('field');
        
        if (['اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم'].includes(grade)) {
            fieldSelect.value = '';
            fieldSelect.disabled = true;
        } else if (['هفتم', 'هشتم', 'نهم'].includes(grade)) {
            fieldSelect.value = '';
            fieldSelect.disabled = true;
        } else {
            fieldSelect.disabled = false;
            if (!fieldSelect.value) {
                fieldSelect.value = '';
            }
        }
    }

    saveDefaultSettings() {
        const defaultSettings = {
            provinceCode: document.getElementById('defaultProvinceCode').value.trim(),
            areaCode: document.getElementById('defaultAreaCode').value.trim(),
            schoolCode: document.getElementById('defaultSchoolCode').value.trim(),
            schoolCity: document.getElementById('defaultSchoolCity').value.trim(),
            schoolName: document.getElementById('defaultSchoolName').value.trim(),
            managerName: document.getElementById('defaultManagerName').value.trim(),
            academicYear: document.getElementById('defaultAcademicYear').value.trim()
        };

        if (!defaultSettings.provinceCode || !defaultSettings.areaCode || !defaultSettings.schoolCode || 
            !defaultSettings.schoolCity || !defaultSettings.schoolName || !defaultSettings.managerName) {
            this.showNotification('لطفاً تمام فیلدهای ضروری تنظیمات را تکمیل کنید', 'error');
            return;
        }

        localStorage.setItem('certificateSystemDefaults', JSON.stringify(defaultSettings));
        this.defaultSettings = defaultSettings;
        this.showNotification('تنظیمات پیشفرض با موفقیت ذخیره شد', 'success');
        this.updateSystemStatus('تنظیمات ذخیره شد');
    }

    loadDefaultSettings() {
        try {
            const savedDefaults = localStorage.getItem('certificateSystemDefaults');
            if (savedDefaults) {
                this.defaultSettings = JSON.parse(savedDefaults);
                
                document.getElementById('defaultProvinceCode').value = this.defaultSettings.provinceCode || '';
                document.getElementById('defaultAreaCode').value = this.defaultSettings.areaCode || '';
                document.getElementById('defaultSchoolCode').value = this.defaultSettings.schoolCode || '';
                document.getElementById('defaultSchoolCity').value = this.defaultSettings.schoolCity || '';
                document.getElementById('defaultSchoolName').value = this.defaultSettings.schoolName || '';
                document.getElementById('defaultManagerName').value = this.defaultSettings.managerName || '';
                document.getElementById('defaultAcademicYear').value = this.defaultSettings.academicYear || '';
                
                console.log('✅ تنظیمات پیشفرض بارگذاری شد');
            }
        } catch (error) {
            console.warn('خطا در بارگذاری تنظیمات پیشفرض:', error);
        }
    }

    loadDefaultSettingsToForm() {
        if (Object.keys(this.defaultSettings).length === 0) {
            this.showNotification('هیچ تنظیمات پیشفرضی ذخیره نشده است', 'warning');
            return;
        }

        document.getElementById('provinceCode').value = this.defaultSettings.provinceCode || '';
        document.getElementById('areaCode').value = this.defaultSettings.areaCode || '';
        document.getElementById('schoolCode').value = this.defaultSettings.schoolCode || '';
        document.getElementById('schoolCity').value = this.defaultSettings.schoolCity || '';
        document.getElementById('schoolName').value = this.defaultSettings.schoolName || '';
        document.getElementById('managerName').value = this.defaultSettings.managerName || '';
        document.getElementById('academicYear').value = this.defaultSettings.academicYear || '';

        this.showNotification('تنظیمات پیشفرض در فرم بارگذاری شد', 'success');
        this.updateSystemStatus('تنظیمات بارگذاری شد');
        
        this.saveFormData();
        this.saveToLocalStorage();
    }

    clearDefaultSettings() {
        if (confirm('آیا از پاک کردن تنظیمات پیشفرض اطمینان دارید؟')) {
            localStorage.removeItem('certificateSystemDefaults');
            this.defaultSettings = {};
            
            document.getElementById('defaultProvinceCode').value = '';
            document.getElementById('defaultAreaCode').value = '';
            document.getElementById('defaultSchoolCode').value = '';
            document.getElementById('defaultSchoolCity').value = '';
            document.getElementById('defaultSchoolName').value = '';
            document.getElementById('defaultManagerName').value = '';
            document.getElementById('defaultAcademicYear').value = '';
            
            this.showNotification('تنظیمات پیشفرض پاک شد', 'success');
            this.updateSystemStatus('تنظیمات پاک شد');
        }
    }

    saveToLocalStorage() {
        const formData = this.getFormData();
        const saveData = {
            formData: formData,
            studentImageUrl: this.studentImageUrl,
            uploadedImage: this.uploadedImage,
            currentTab: this.currentTab,
            currentDocumentType: this.currentDocumentType
        };
        localStorage.setItem('certificateSystemData', JSON.stringify(saveData));
    }

    loadFormData() {
        try {
            const savedData = localStorage.getItem('certificateSystemData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                if (data.formData) {
                    this.setFormData(data.formData);
                    if (data.formData.grade) {
                        this.updateFieldBasedOnGrade(data.formData.grade);
                    }
                }
                
                if (data.studentImageUrl) {
                    this.studentImageUrl = data.studentImageUrl;
                    this.updateImagePreview(this.studentImageUrl);
                    this.updateImageStatus('تصویر بارگذاری شده', 'success');
                    this.toggleRemoveImageButton(true);
                }
                
                if (data.uploadedImage) {
                    this.uploadedImage = data.uploadedImage;
                    this.updateImagePreview(this.uploadedImage);
                    this.updateImageStatus('تصویر آپلود شده', 'success');
                    this.toggleRemoveImageButton(true);
                }
                
                if (data.currentTab) {
                    this.switchTab(data.currentTab);
                }
                
                if (data.currentDocumentType) {
                    this.currentDocumentType = data.currentDocumentType;
                    this.updateDocumentTypeUI();
                }
                
                this.showNotification('اطلاعات قبلی بازیابی شد', 'success');
            } else {
                this.loadDefaultSettingsToForm();
            }
        } catch (error) {
            console.warn('خطا در بارگذاری داده‌های ذخیره شده:', error);
        }
    }

    setFormData(formData) {
        document.getElementById('nationalCode').value = formData.nationalCode || '';
        document.getElementById('studentName').value = formData.studentName || '';
        document.getElementById('fatherName').value = formData.fatherName || '';
        document.getElementById('birthCity').value = formData.birthCity || '';
        document.getElementById('birthDate').value = formData.birthDate || '';
        document.getElementById('provinceCode').value = formData.provinceCode || '';
        document.getElementById('areaCode').value = formData.areaCode || '';
        document.getElementById('schoolCode').value = formData.schoolCode || '';
        document.getElementById('schoolCity').value = formData.schoolCity || '';
        document.getElementById('grade').value = formData.grade || '';
        document.getElementById('field').value = formData.field || '';
        document.getElementById('academicYear').value = formData.academicYear || '';
        document.getElementById('schoolName').value = formData.schoolName || '';
        document.getElementById('managerName').value = formData.managerName || '';
        document.getElementById('documentNumber').value = formData.documentNumber || formData.letterNumber || '';
        document.getElementById('forOrganization').value = formData.forOrganization || (this.currentDocumentType === 'letter' ? 'وظیفه عمومی' : 'ثبت احوال');
        document.getElementById('documentDate').value = formData.documentDate || formData.letterDate || '';
        document.getElementById('militaryCity').value = formData.militaryCity || 'قوچان';
        document.getElementById('studyStartDate').value = formData.studyStartDate || '';
        document.getElementById('additionalNotes').value = formData.additionalNotes || '';
    }

    saveFormData() {
        this.formData = this.getFormData();
    }

    getFormData() {
        const getValue = id => {
            const element = document.getElementById(id);
            return element ? element.value.trim() : '';
        };

        return {
            nationalCode: getValue('nationalCode'),
            provinceCode: getValue('provinceCode'),
            areaCode: getValue('areaCode'),
            schoolCode: getValue('schoolCode'),
            schoolCity: getValue('schoolCity'),
            studentName: getValue('studentName'),
            fatherName: getValue('fatherName'),
            birthCity: getValue('birthCity'),
            birthDate: getValue('birthDate'),
            grade: getValue('grade'),
            field: getValue('field'),
            academicYear: getValue('academicYear'),
            schoolName: getValue('schoolName'),
            managerName: getValue('managerName'),
            documentNumber: getValue('documentNumber'),
            forOrganization: getValue('forOrganization'),
            documentDate: getValue('documentDate'),
            militaryCity: getValue('militaryCity'),
            studyStartDate: getValue('studyStartDate'),
            additionalNotes: getValue('additionalNotes'),
            issueDate: this.getCurrentPersianDate(),
            documentType: this.currentDocumentType
        };
    }

    getCurrentPersianDate() {
        const today = new Date();
        const persianDate = this.gregorianToJalali(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        );
        
        return `${this.toPersianNumbers(persianDate[0])}/${this.toPersianNumbers(this.formatMonth(persianDate[1]))}/${this.toPersianNumbers(this.formatMonth(persianDate[2]))}`;
    }

    gregorianToJalali(gy, gm, gd) {
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let gy2 = (gm > 2) ? (gy + 1) : gy;
        let days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        let jy = -1595 + (33 * ~~(days / 12053));
        days %= 12053;
        jy += 4 * ~~(days / 1461);
        days %= 1461;
        if (days > 365) {
            jy += ~~((days - 1) / 365);
            days = (days - 1) % 365;
        }
        let jm = (days < 186) ? 1 + ~~(days / 31) : 7 + ~~((days - 186) / 30);
        let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
        return [jy, jm, jd];
    }

    formatMonth(month) {
        return month.toString().padStart(2, '0');
    }

    triggerImageUpload() {
        document.getElementById('imageUpload').click();
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                this.showNotification('لطفاً یک فایل تصویری انتخاب کنید', 'error');
                return;
            }

            const compressedImage = await this.compressImage(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedImage = e.target.result;
                this.studentImageUrl = this.uploadedImage;
                this.updateImagePreview(this.uploadedImage);
                this.updateImageStatus('تصویر با موفقیت آپلود و فشرده شد', 'success');
                this.showNotification('تصویر دانش‌آموز آپلود شد', 'success');
                this.updateSystemStatus('تصویر آپلود شد');
                this.toggleRemoveImageButton(true);
                this.saveToLocalStorage();
                
                if (this.currentTab === 'preview') {
                    this.updatePreview();
                }
            };
            reader.readAsDataURL(compressedImage);
        }
    }

    compressImage(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    removeImage() {
        this.studentImageUrl = null;
        this.uploadedImage = null;
        document.getElementById('imagePreview').innerHTML = `
            <div class="image-placeholder">
                <i class="fas fa-user"></i>
                <span>تصویر دانش‌آموز</span>
            </div>
        `;
        document.getElementById('imageUpload').value = '';
        this.updateImageStatus('تصویر بارگذاری نشده', 'default');
        this.toggleRemoveImageButton(false);
        this.saveToLocalStorage();
        
        if (this.currentTab === 'preview') {
            this.updatePreview();
        }
        
        this.showNotification('تصویر حذف شد', 'success');
    }

    toggleRemoveImageButton(show) {
        const removeBtn = document.getElementById('removeImageBtn');
        removeBtn.style.display = show ? 'inline-flex' : 'none';
    }

    async fetchStudentImage() {
        const data = this.getFormData();
        
        if (!this.validateImageData(data)) {
            return;
        }

        try {
            this.updateImageStatus('در حال دریافت تصویر از سامانه سیدا...', 'loading');
            this.updateSystemStatus('دریافت تصویر در حال انجام است');
            
            const fileCode = data.nationalCode.replace(/^0+/, '');
            const url = `https://sida.medu.ir/ImageStudent/${data.provinceCode}/${data.areaCode}/${data.schoolCode}/${fileCode}.jpg`;

            console.log('🔗 آدرس تصویر سیدا:', url);

            const testImage = new Image();
            
            testImage.onload = () => {
                console.log('✅ تصویر با موفقیت دریافت شد');
                this.studentImageUrl = url;
                this.uploadedImage = null;
                this.updateImagePreview(url);
                this.updateImageStatus('تصویر با موفقیت دریافت شد', 'success');
                this.showNotification('تصویر دانش‌آموز از سامانه سیدا دریافت شد', 'success');
                this.updateSystemStatus('تصویر دریافت شد');
                this.toggleRemoveImageButton(true);
                this.saveToLocalStorage();
                
                if (this.currentTab === 'preview') {
                    this.updatePreview();
                }
            };

            testImage.onerror = () => {
                console.log('❌ تصویر یافت نشد');
                this.updateImageStatus('تصویر یافت نشد', 'error');
                this.showNotification(`تصویر برای کد ملی ${data.nationalCode} در سامانه سیدا یافت نشد. لطفاً از صحت کدهای آموزشگاه اطمینان حاصل کنید.`, 'warning');
                this.updateSystemStatus('تصویر یافت نشد');
            };

            testImage.src = url;

        } catch (error) {
            console.error('💥 خطا در دریافت تصویر:', error);
            this.updateImageStatus('خطا در دریافت تصویر', 'error');
            this.showNotification('خطا در ارتباط با سامانه سیدا. لطفاً اینترنت خود را بررسی کنید.', 'error');
            this.updateSystemStatus('خطا در دریافت تصویر');
        }
    }

    validateImageData(data) {
        const validations = [
            { field: data.nationalCode, pattern: /^\d{10}$/, message: 'کد ملی باید ۱۰ رقمی باشد' },
            { field: data.provinceCode, pattern: /^\d{2}$/, message: 'کد استان باید ۲ رقمی باشد' },
            { field: data.areaCode, pattern: /^\d{4}$/, message: 'کد منطقه باید ۴ رقمی باشد' },
            { field: data.schoolCode, pattern: /^\d{8}$/, message: 'کد آموزشگاه باید ۸ رقمی باشد' }
        ];

        for (const validation of validations) {
            if (!validation.pattern.test(validation.field)) {
                this.showNotification(validation.message, 'error');
                return false;
            }
        }
        return true;
    }

    updateImagePreview(imageUrl) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `
            <img src="${imageUrl}" alt="تصویر دانش‌آموز" style="width: 100%; height: 100%; object-fit: cover;">
        `;
    }

    updateImageStatus(message, type = 'default') {
        const statusElement = document.getElementById('imageStatus');
        
        statusElement.innerHTML = `
            <i class="fas fa-${this.getStatusIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        const colors = {
            success: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: 'rgba(16, 185, 129, 0.2)' },
            error: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: 'rgba(239, 68, 68, 0.2)' },
            loading: { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: 'rgba(59, 130, 246, 0.2)' },
            default: { bg: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)', border: 'rgba(148, 163, 184, 0.2)' }
        };
        
        const style = colors[type] || colors.default;
        statusElement.style.background = style.bg;
        statusElement.style.color = style.color;
        statusElement.style.border = `1px solid ${style.border}`;
    }

    getStatusIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            loading: 'spinner fa-spin',
            default: 'info-circle'
        };
        return icons[type] || icons.default;
    }

    saveCurrentCertificate() {
        const data = this.getFormData();
        
        if (!this.validateCertificateData(data)) {
            this.showNotification('لطفاً اطلاعات ضروری را تکمیل کنید', 'error');
            return;
        }

        const certificate = {
            id: Date.now().toString(),
            ...data,
            image: this.uploadedImage || this.studentImageUrl,
            createdAt: new Date().toISOString(),
            issueDate: this.getCurrentPersianDate()
        };

        const existingIndex = this.savedCertificates.findIndex(cert => 
            cert.nationalCode === certificate.nationalCode && 
            cert.academicYear === certificate.academicYear &&
            cert.documentType === certificate.documentType
        );

        if (existingIndex !== -1) {
            this.savedCertificates[existingIndex] = certificate;
            this.showNotification('سند با موفقیت به‌روزرسانی شد', 'success');
        } else {
            this.savedCertificates.unshift(certificate);
            this.showNotification('سند با موفقیت ذخیره شد', 'success');
        }

        this.saveCertificatesToStorage();
        this.updateCertificateHistory();
        this.updateStats();
    }

    validateCertificateData(data) {
        const baseFields = data.nationalCode && data.studentName && data.fatherName && 
               data.birthCity && data.grade && data.schoolName && 
               data.managerName && data.academicYear && data.documentNumber && data.documentDate;
        
        if (this.currentDocumentType === 'letter') {
            return baseFields && data.militaryCity && data.studyStartDate;
        }
        
        return baseFields;
    }

    loadSavedCertificates() {
        try {
            const saved = localStorage.getItem('certificateSystemCertificates');
            if (saved) {
                this.savedCertificates = JSON.parse(saved);
                this.updateCertificateHistory();
                this.updateStats();
            }
        } catch (error) {
            console.warn('خطا در بارگذاری اسناد ذخیره شده:', error);
            this.savedCertificates = [];
        }
    }

    saveCertificatesToStorage() {
        localStorage.setItem('certificateSystemCertificates', JSON.stringify(this.savedCertificates));
    }

    updateCertificateHistory() {
        const list = document.getElementById('certificatesList');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const documentTypeFilter = document.getElementById('documentTypeFilter').value;
        
        let filteredCertificates = this.savedCertificates;
        
        if (documentTypeFilter !== 'all') {
            filteredCertificates = filteredCertificates.filter(cert => cert.documentType === documentTypeFilter);
        }
        
        if (searchTerm) {
            filteredCertificates = filteredCertificates.filter(cert =>
                cert.studentName.toLowerCase().includes(searchTerm) ||
                cert.nationalCode.includes(searchTerm)
            );
        }

        if (filteredCertificates.length === 0) {
            list.innerHTML = `
                <div class="certificate-item empty">
                    <i class="fas fa-file-alt"></i>
                    <div>هیچ سندی یافت نشد</div>
                </div>
            `;
            return;
        }

        list.innerHTML = filteredCertificates.map(cert => {
            const badgeClass = cert.documentType === 'certificate' ? 'badge-certificate' : 'badge-letter';
            const badgeIcon = cert.documentType === 'certificate' ? 'file-certificate' : 'envelope';
            const badgeText = cert.documentType === 'certificate' ? 'گواهی' : 'نامه';
            
            return `
            <div class="certificate-item">
                <div class="certificate-info">
                    <div class="certificate-student">
                        <span class="document-type-badge ${badgeClass}">
                            <i class="fas fa-${badgeIcon}"></i>
                            ${badgeText}
                        </span>
                        ${cert.studentName}
                    </div>
                    <div class="certificate-details">
                        <span>کد ملی: ${this.toPersianNumbers(cert.nationalCode)}</span>
                        <span>پایه: ${cert.grade}</span>
                        <span>تاریخ: ${cert.issueDate}</span>
                    </div>
                </div>
                <div class="certificate-actions">
                    <button class="btn btn-outline btn-sm" onclick="certificateSystem.loadCertificate('${cert.id}')">
                        <i class="fas fa-edit"></i>
                        ویرایش
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="certificateSystem.printCertificateById('${cert.id}')">
                        <i class="fas fa-print"></i>
                        چاپ
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="certificateSystem.deleteCertificate('${cert.id}')">
                        <i class="fas fa-trash"></i>
                        حذف
                    </button>
                </div>
            </div>
        `}).join('');
    }

    loadCertificate(id) {
        const certificate = this.savedCertificates.find(cert => cert.id === id);
        if (certificate) {
            this.setFormData(certificate);
            if (certificate.image) {
                this.studentImageUrl = certificate.image;
                this.uploadedImage = certificate.image;
                this.updateImagePreview(certificate.image);
                this.updateImageStatus('تصویر بارگذاری شده', 'success');
                this.toggleRemoveImageButton(true);
            }
            this.changeDocumentType(certificate.documentType);
            this.switchTab('student-info');
            this.showNotification('سند بارگذاری شد', 'success');
        }
    }

    printCertificateById(id) {
        const certificate = this.savedCertificates.find(cert => cert.id === id);
        if (certificate) {
            const currentData = this.getFormData();
            const currentType = this.currentDocumentType;
            
            this.setFormData(certificate);
            this.changeDocumentType(certificate.documentType);
            this.printCertificate();
            
            this.setFormData(currentData);
            this.changeDocumentType(currentType);
        }
    }

    deleteCertificate(id) {
        if (confirm('آیا از حذف این سند اطمینان دارید؟')) {
            this.savedCertificates = this.savedCertificates.filter(cert => cert.id !== id);
            this.saveCertificatesToStorage();
            this.updateCertificateHistory();
            this.updateStats();
            this.showNotification('سند حذف شد', 'success');
        }
    }

    filterCertificates() {
        this.updateCertificateHistory();
    }

    updateStats() {
        const total = this.savedCertificates.length;
        const certificates = this.savedCertificates.filter(cert => cert.documentType === 'certificate').length;
        const letters = this.savedCertificates.filter(cert => cert.documentType === 'letter').length;
        const uniqueStudents = new Set(this.savedCertificates.map(cert => cert.nationalCode)).size;
        
        document.getElementById('totalCertificates').textContent = this.toPersianNumbers(total);
        document.getElementById('totalCertificatesType').textContent = this.toPersianNumbers(certificates);
        document.getElementById('totalLetters').textContent = this.toPersianNumbers(letters);
        document.getElementById('uniqueStudents').textContent = this.toPersianNumbers(uniqueStudents);
    }

    exportData() {
        const exportData = {
            certificates: this.savedCertificates,
            settings: this.defaultSettings,
            studentDatabase: this.studentDatabase,
            exportDate: new Date().toISOString(),
            version: '5.2.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `certificate-backup-${this.getCurrentPersianDate().replace(/\//g, '-')}.json`;
        link.click();
        
        this.showNotification('داده‌ها با موفقیت export شدند', 'success');
    }

    triggerImport() {
        document.getElementById('importFile').click();
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (confirm(`آیا از وارد کردن اطلاعات اطمینان دارید؟`)) {
                    if (importedData.certificates) {
                        this.savedCertificates = importedData.certificates;
                        this.saveCertificatesToStorage();
                    }
                    
                    if (importedData.settings) {
                        this.defaultSettings = importedData.settings;
                        localStorage.setItem('certificateSystemDefaults', JSON.stringify(this.defaultSettings));
                    }
                    
                    if (importedData.studentDatabase) {
                        this.studentDatabase = importedData.studentDatabase;
                        localStorage.setItem('studentDatabase', JSON.stringify(this.studentDatabase));
                        this.updateStudentDatabaseStats();
                    }
                    
                    this.updateCertificateHistory();
                    this.updateStats();
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

    updatePreview() {
        const data = this.getFormData();
        const template = document.getElementById('printTemplate').value;
        const preview = document.getElementById('certificatePreview');
        
        if (!preview) return;
        
        // بررسی وجود اطلاعات ضروری
        if (!data.studentName || !data.grade || !data.schoolName) {
            preview.innerHTML = `
                <div class="certificate-placeholder">
                    <div class="placeholder-icon">
                        <i class="fas fa-file-certificate"></i>
                    </div>
                    <h3>پیش‌نمایش سند</h3>
                    <p>لطفاً تمام اطلاعات ضروری را در تب‌های قبل تکمیل کنید</p>
                    <div class="missing-fields" id="missingFields"></div>
                </div>
            `;
            
            const missingFields = document.getElementById('missingFields');
            if (missingFields) {
                const requiredFields = this.getRequiredFields();
                const missing = requiredFields.filter(field => !data[field.id]);
                if (missing.length > 0) {
                    missingFields.innerHTML = `<div style="margin-top: 15px; color: #ef4444;">⚠️ اطلاعات زیر کامل نیست: ${missing.map(m => m.label).join('، ')}</div>`;
                }
            }
            return;
        }

        // ایجاد HTML سند
        const certificateHTML = this.generateCertificateHTML(data, template);
        preview.innerHTML = certificateHTML;
    }

    getRequiredFields() {
        const baseFields = [
            { id: 'nationalCode', label: 'کد ملی' },
            { id: 'studentName', label: 'نام دانش‌آموز' },
            { id: 'fatherName', label: 'نام پدر' },
            { id: 'birthCity', label: 'شهر محل صدور شناسنامه' },
            { id: 'birthDate', label: 'تاریخ تولد' },
            { id: 'provinceCode', label: 'کد استان' },
            { id: 'areaCode', label: 'کد منطقه' },
            { id: 'schoolCode', label: 'کد آموزشگاه' },
            { id: 'schoolCity', label: 'شهر آموزشگاه' },
            { id: 'schoolName', label: 'نام آموزشگاه' },
            { id: 'managerName', label: 'نام مدیر' },
            { id: 'grade', label: 'پایه تحصیلی' },
            { id: 'academicYear', label: 'سال تحصیلی' },
            { id: 'documentNumber', label: 'شماره سند' },
            { id: 'documentDate', label: 'تاریخ سند' }
        ];
        
        if (this.currentDocumentType === 'letter') {
            return [
                ...baseFields,
                { id: 'militaryCity', label: 'شهرستان وظیفه عمومی' },
                { id: 'studyStartDate', label: 'تاریخ شروع تحصیل' }
            ];
        }
        
        return baseFields;
    }

    generateCertificateHTML(data, template = 'official') {
        if (this.currentDocumentType === 'letter') {
            return this.generateLetterHTML(data, template);
        } else {
            return this.generateCertificateHTMLSimple(data, template);
        }
    }

    generateCertificateHTMLSimple(data, template = 'official') {
        const imageSrc = this.uploadedImage || this.studentImageUrl;
        const imageHTML = imageSrc ? 
            `<div class="student-photo">
                <img src="${imageSrc}" alt="تصویر دانش‌آموز" onerror="this.parentElement.innerHTML='<div class=\'student-photo placeholder\'><div>بدون تصویر</div></div>'">
            </div>` : 
            `<div class="student-photo placeholder">
                <div>بدون تصویر</div>
            </div>`;

        const persianNationalCode = this.toPersianNumbers(data.nationalCode) || '---';
        const persianBirthDate = this.toPersianNumbers(data.birthDate) || '---';
        const persianDocumentNumber = this.toPersianNumbers(data.documentNumber) || '---';
        const persianAcademicYear = this.toPersianNumbers(data.academicYear) || '---';
        const persianDocumentDate = this.toPersianNumbers(data.documentDate) || this.toPersianNumbers(data.issueDate) || '---';

        const fieldText = data.field && (data.grade === 'دهم' || data.grade === 'یازدهم' || data.grade === 'دوازدهم') ? 
            ` رشته <strong>${data.field}</strong>` : '';
        
        const forOrganization = data.forOrganization || 'ثبت احوال';
        
        const templateClass = template !== 'official' ? template : '';

        return `
            <div class="certificate ${templateClass}" style="max-width: 100%; margin: 0 auto;">
                <div class="certificate-header-official">
                    <div class="besmellah">بسمه تعالی</div>
                    <div class="govt-header">جمهوری اسلامی ایران</div>
                    <div class="education-ministry">وزارت آموزش و پرورش</div>
                </div>
                
                <div class="certificate-header">
                    <div class="certificate-title">گواهی اشتغال به تحصیل</div>
                    <div class="certificate-info-right">
                        <div class="certificate-number">شماره: ${persianDocumentNumber}</div>
                        <div class="certificate-date">تاریخ: ${persianDocumentDate}</div>
                    </div>
                </div>
                
                <div class="certificate-body">
                    <div class="certificate-content">
                        <div class="certificate-text">
                            <div class="certificate-paragraph">
                                بدین وسیله گواهی می‌شود دانش‌آموز <strong>${data.studentName}</strong> فرزند <strong>${data.fatherName}</strong> 
                                به کد ملی <strong>${persianNationalCode}</strong> صادره از <strong>${data.birthCity || '---'}</strong> 
                                متولد <strong>${persianBirthDate}</strong> در سال تحصیلی <strong>${persianAcademicYear}</strong> 
                                در پایه‌ی <strong>${data.grade}</strong>${fieldText} مدرسه <strong>${data.schoolName}</strong> 
                                آموزش و پرورش <strong>${data.schoolCity || '---'}</strong> مشغول به تحصیل می‌باشد.
                            </div>
                            
                            <div class="certificate-paragraph">
                                این گواهی طبق تقاضای مورخ <strong>${persianDocumentDate}</strong> فقط به منظور ارائه به <strong>${forOrganization}</strong> صادر گردیده و فاقد هرگونه ارزش دیگری می‌باشد.
                            </div>
                            ${data.additionalNotes ? `<div class="certificate-paragraph"><strong>توضیحات:</strong> ${data.additionalNotes}</div>` : ''}
                        </div>
                        ${imageHTML}
                    </div>
                </div>
                
                <div class="certificate-footer">
                    <div class="signature-section">
                        <div class="signature-name">${data.managerName || '---'}</div>
                        <div class="signature-title">مدیر آموزشگاه ${data.schoolName || '---'}</div>
                        <div class="signature-line"></div>
                        <div class="signature-label">امضا و مهر</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateLetterHTML(data, template = 'official') {
        const imageSrc = this.uploadedImage || this.studentImageUrl;
        
        const imageHTML = imageSrc ? 
            `<div class="student-photo-compact">
                <img src="${imageSrc}" alt="تصویر دانش‌آموز" onerror="this.parentElement.innerHTML='<div class=\'student-photo-compact placeholder\'><div>بدون تصویر</div></div>'">
            </div>` : 
            `<div class="student-photo-compact placeholder">
                <div>بدون تصویر</div>
            </div>`;

        const persianNationalCode = this.toPersianNumbers(data.nationalCode) || '---';
        const persianBirthDate = this.toPersianNumbers(data.birthDate) || '---';
        const persianDocumentNumber = this.toPersianNumbers(data.documentNumber) || '---';
        const persianAcademicYear = this.toPersianNumbers(data.academicYear) || '---';
        const persianStudyStartDate = this.toPersianNumbers(data.studyStartDate) || '---';
        const persianDocumentDate = this.toPersianNumbers(data.documentDate) || this.toPersianNumbers(data.issueDate) || '---';

        const fieldText = data.field && (data.grade === 'دهم' || data.grade === 'یازدهم' || data.grade === 'دوازدهم') ? 
            ` رشته <strong>${data.field}</strong>` : '';
        
        const militaryCity = data.militaryCity || 'قوچان';
        const forOrganization = data.forOrganization || 'وظیفه عمومی';
        
        const templateClass = template !== 'official' ? template : '';

        return `
            <div class="letter ${templateClass}" style="max-width: 100%; margin: 0 auto;">
                <div class="letter-header-official">
                    <div class="besmellah">بسمه تعالی</div>
                    <div class="govt-header">جمهوری اسلامی ایران</div>
                    <div class="education-ministry">وزارت آموزش و پرورش</div>
                    <div class="letter-info-compact">
                        <div class="letter-number">شماره: ${persianDocumentNumber}</div>
                        <div class="letter-date">تاریخ: ${persianDocumentDate}</div>
                    </div>
                </div>

                <div class="letter-header-with-photo">
                    <div class="letter-header-info">
                        <div class="letter-title">درخواست معافیت تحصیلی دانش آموزان</div>
                    </div>
                    ${imageHTML}
                </div>
                
                <div class="letter-body-compact">
                    <div class="letter-content-compact">
                        <div class="letter-paragraph">
                            <strong>وظیفه عمومی شهرستان ${militaryCity}</strong>
                        </div>
                        
                        <div class="letter-paragraph">
                            <strong>با سلام و احترام</strong>
                        </div>
                        
                        <div class="letter-paragraph">
                            به آگاهی می‌رساند، مشمول آقای <strong>${data.studentName}</strong> فرزند <strong>${data.fatherName}</strong> 
                            به کد ملی <strong>${persianNationalCode}</strong> صادره از <strong>${data.birthCity || '---'}</strong> 
                            متولد <strong>${persianBirthDate}</strong> که از تاریخ <strong>${persianStudyStartDate}</strong> 
                            در پایه‌ی <strong>${data.grade}</strong>${fieldText} مدرسه <strong>${data.schoolName}</strong> 
                            آموزش و پرورش <strong>${data.schoolCity || '---'}</strong> شروع به تحصیل نموده است، برای اخذ معافیت تحصیلی معرفی می‌شود.
                        </div>
                        
                        <div class="letter-paragraph">
                            ضمناً نامبرده در سن مشمولیت فاقد هر گونه وقفه تحصیلی منجر به اخراج یا ترک تحصیل بوده و در شرایط زیر نیز قرار ندارد:
                        </div>
                        
                        <div class="letter-conditions">
                            <ul>
                                <li><i class="fas fa-ban"></i> دانش آموزانی که بعد از ورود به سن مشمولیت به صورت داوطلب آزاد اشتغال به تحصیل نموده اند.</li>
                                <li><i class="fas fa-ban"></i> دانش آموزانی که قبل یا بعد از سن مشمولیت موفق به اخذ دیپلم متوسطه شده باشند.</li>
                                <li><i class="fas fa-ban"></i> دانش اموزانی که بعد از سن مشمولیت بیش از سه ماه متوالی وقفه تحصیلی غیر موجه داشته و یا اینکه بعد از سن مشمولیت انصراف، اخراج یا ترک تحصیل نموده باشند.</li>
                            </ul>
                        </div>
                        
                        <div class="letter-paragraph">
                            این نامه طبق تقاضای مورخ <strong>${persianDocumentDate}</strong> فقط به منظور ارائه به <strong>${forOrganization}</strong> صادر گردیده است.
                        </div>
                        ${data.additionalNotes ? `<div class="letter-paragraph"><strong>توضیحات:</strong> ${data.additionalNotes}</div>` : ''}
                    </div>
                </div>
                
                <div class="letter-footer">
                    <div class="signature-section">
                        <div class="signature-name">${data.managerName || '---'}</div>
                        <div class="signature-title">مدیر آموزشگاه ${data.schoolName || '---'}</div>
                        <div class="signature-line"></div>
                        <div class="signature-label">امضا و مهر</div>
                    </div>
                </div>
            </div>
        `;
    }

    printCertificate() {
        const data = this.getFormData();
        
        if (!this.validateCertificateData(data)) {
            this.showNotification('لطفاً اطلاعات ضروری را قبل از چاپ تکمیل کنید', 'error');
            return;
        }

        const template = document.getElementById('printTemplate').value;
        const printContent = this.generatePrintContent(data, template);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        printWindow.onload = function() {
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                setTimeout(() => {
                    printWindow.close();
                }, 100);
            }, 500);
        };
    }

    generatePrintContent(data, template = 'official') {
        if (this.currentDocumentType === 'letter') {
            return this.generateLetterPrintContent(data, template);
        } else {
            return this.generateCertificatePrintContent(data, template);
        }
    }

    generateCertificatePrintContent(data, template = 'official') {
        const imageSrc = this.uploadedImage || this.studentImageUrl;
        const imageHTML = imageSrc ? 
            `<div class="student-photo">
                <img src="${imageSrc}" alt="تصویر دانش‌آموز">
            </div>` : 
            `<div class="student-photo placeholder">
                <div>بدون تصویر</div>
            </div>`;

        const persianNationalCode = this.toPersianNumbers(data.nationalCode);
        const persianBirthDate = this.toPersianNumbers(data.birthDate) || '---';
        const persianDocumentNumber = this.toPersianNumbers(data.documentNumber) || '---';
        const persianAcademicYear = this.toPersianNumbers(data.academicYear) || '---';

        const fieldText = data.field ? ` رشته <strong>${data.field}</strong>` : '';
        const forOrganization = data.forOrganization || 'ثبت احوال';
        let requestDate = data.documentDate || data.issueDate;

        const templateClass = template !== 'official' ? template : '';
        const templateStyles = this.getTemplateStyles(template, 'certificate');

        return `
            <!DOCTYPE html>
            <html dir="rtl" lang="fa">
            <head>
                <meta charset="UTF-8">
                <title>گواهی تحصیلی - ${data.studentName}</title>
                <style>
                   @font-face {
                        font-family: 'Vazir';
                        src: url('../font/Vazirmatn.woff2') format('woff2');
                        font-weight: normal;
                        font-style: normal;
                        font-display: swap;
                    }
                    
                    @font-face {
                        font-family: 'Vazir';
                        src: url('../font/Vazirmatn-Bold.woff2') format('woff2');
                        font-weight: bold;
                        font-style: normal;
                        font-display: swap;
                    }
                    
                    * {
                        font-family: 'Vazir', 'Segoe UI', system-ui, sans-serif;
                    }
                    
                    body {
                        font-family: 'Vazir', sans-serif;
                        margin: 0;
                        padding: 0;
                        background: white;
                        color: #000;
                        line-height: 2;
                        direction: rtl;
                    }
                    
                    ${templateStyles}
                    
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        .certificate {
                            border: none;
                            padding: 15mm;
                            margin: 0;
                            box-shadow: none;
                            page-break-after: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="certificate ${templateClass}">
                    <div class="certificate-header-official">
                        <div class="besmellah">بسمه تعالی</div>
                        <div class="govt-header">جمهوری اسلامی ایران</div>
                        <div class="education-ministry">وزارت آموزش و پرورش</div>
                    </div>
                    
                    <div class="certificate-header">
                        <div class="certificate-title-container">
                            <div class="certificate-title">گواهی اشتغال به تحصیل</div>
                        </div>
                        <div class="certificate-info-right">
                            <div class="certificate-number">شماره: ${persianDocumentNumber}</div>
                            <div class="certificate-date">تاریخ: ${this.toPersianNumbers(data.documentDate || data.issueDate)}</div>
                        </div>
                    </div>
                    
                    <div class="certificate-body">
                        <div class="certificate-content">
                            <div class="certificate-text">
                                <div class="certificate-paragraph">
                                    بدین وسیله گواهی می‌شود دانش‌آموز <strong>${data.studentName}</strong> فرزند <strong>${data.fatherName}</strong> 
                                    به کد ملی <strong>${persianNationalCode}</strong> صادره از <strong>${data.birthCity}</strong> 
                                    متولد <strong>${persianBirthDate}</strong> در سال تحصیلی <strong>${persianAcademicYear}</strong> 
                                    در پایه‌ی <strong>${data.grade}</strong>${fieldText} مدرسه <strong>${data.schoolName}</strong> 
                                    آموزش و پرورش <strong>${data.schoolCity}</strong> مشغول به تحصیل می‌باشد.
                                </div>
                                
                                <div class="certificate-paragraph">
                                    این گواهی طبق تقاضای مورخ <strong>${this.toPersianNumbers(requestDate)}</strong> فقط به منظور ارائه به <strong>${forOrganization}</strong> صادر گردیده و فاقد هرگونه ارزش دیگری می‌باشد.
                                </div>
                            </div>
                            ${imageHTML}
                        </div>
                    </div>
                    
                    <div class="certificate-footer">
                        <div class="signature-section">
                            <div class="signature-name">${data.managerName}</div>
                            <div class="signature-title">مدیر آموزشگاه ${data.schoolName}</div>
                            <div class="signature-line"></div>
                            <div class="signature-label">امضا و مهر</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    generateLetterPrintContent(data, template = 'official') {
        const imageSrc = this.uploadedImage || this.studentImageUrl;
        
        const imageHTML = imageSrc ? 
            `<div class="student-photo-compact">
                <img src="${imageSrc}" alt="تصویر دانش‌آموز">
            </div>` : 
            `<div class="student-photo-compact placeholder">
                <div>بدون تصویر</div>
            </div>`;

        const persianNationalCode = this.toPersianNumbers(data.nationalCode);
        const persianBirthDate = this.toPersianNumbers(data.birthDate) || '---';
        const persianDocumentNumber = this.toPersianNumbers(data.documentNumber) || '---';
        const persianAcademicYear = this.toPersianNumbers(data.academicYear) || '---';
        const persianStudyStartDate = this.toPersianNumbers(data.studyStartDate) || '---';

        const fieldText = data.field ? ` رشته <strong>${data.field}</strong>` : '';
        const militaryCity = data.militaryCity || 'قوچان';
        const forOrganization = data.forOrganization || 'وظیفه عمومی';

        const templateClass = template !== 'official' ? template : '';
        const templateStyles = this.getLetterPrintStyles(template);

        return `
            <!DOCTYPE html>
            <html dir="rtl" lang="fa">
            <head>
                <meta charset="UTF-8">
                <title>نامه معافیت تحصیلی - ${data.studentName}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;300;400;500;700;900&display=swap');
                    
                    body {
                        font-family: 'Vazir', sans-serif;
                        margin: 0;
                        padding: 0;
                        background: white;
                        color: #000;
                        line-height: 1.6;
                        direction: rtl;
                        width: 210mm;
                        height: 297mm;
                    }
                    
                    ${templateStyles}
                    
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                            width: 210mm;
                            height: 297mm;
                            overflow: hidden;
                        }
                        .letter {
                            border: none;
                            padding: 15mm;
                            margin: 0;
                            box-shadow: none;
                            page-break-after: avoid;
                            page-break-inside: avoid;
                            height: 277mm;
                            display: flex;
                            flex-direction: column;
                        }
                        .letter-header-with-photo {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            margin-bottom: 8mm;
                            border-bottom: 2px solid #1a365d;
                            padding-bottom: 4mm;
                        }
                    }
                    
                    @page {
                        size: A4;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="letter ${templateClass}">
                    <div class="letter-header-official">
                        <div class="besmellah">بسمه تعالی</div>
                        <div class="govt-header">جمهوری اسلامی ایران</div>
                        <div class="education-ministry">وزارت آموزش و پرورش</div>
                        <div class="letter-info-compact">
                            <div class="letter-number">شماره: ${persianDocumentNumber}</div>
                            <div class="letter-date">تاریخ: ${this.toPersianNumbers(data.documentDate || data.issueDate)}</div>
                        </div>
                    </div>

                    <div class="letter-header-with-photo">
                        <div class="letter-header-info">
                            <div class="letter-title-container">
                                <div class="letter-title">درخواست معافیت تحصیلی دانش آموزان</div>
                            </div>
                        </div>
                        ${imageHTML}
                    </div>
                    
                    <div class="letter-body-compact">
                        <div class="letter-content-compact">
                            <div class="letter-paragraph">
                                <strong>وظیفه عمومی شهرستان ${militaryCity}</strong>
                            </div>
                            
                            <div class="letter-paragraph">
                                <strong>با سلام و احترام</strong>
                            </div>
                            
                            <div class="letter-paragraph">
                                به آگاهی می‌رساند، مشمول آقای <strong>${data.studentName}</strong> فرزند <strong>${data.fatherName}</strong> 
                                به کد ملی <strong>${persianNationalCode}</strong> صادره از <strong>${data.birthCity}</strong> 
                                متولد <strong>${persianBirthDate}</strong> که از تاریخ <strong>${persianStudyStartDate}</strong> 
                                در پایه‌ی <strong>${data.grade}</strong>${fieldText} مدرسه <strong>${data.schoolName}</strong> 
                                آموزش و پرورش <strong>${data.schoolCity}</strong> شروع به تحصیل نموده است، برای اخذ معافیت تحصیلی معرفی می‌شود.
                            </div>
                            
                            <div class="letter-paragraph">
                                ضمناً نامبرده در سن مشمولیت فاقد هر گونه وقفه تحصیلی منجر به اخراج یا ترک تحصیل بوده و در شرایط زیر نیز قرار ندارد:
                            </div>
                            
                            <div class="letter-conditions">
                                <ul>
                                    <li><i class="fas fa-ban"></i> دانش آموزانی که بعد از ورود به سن مشمولیت به صورت داوطلب آزاد اشتغال به تحصیل نموده اند.</li>
                                    <li><i class="fas fa-ban"></i> دانش آموزانی که قبل یا بعد از سن مشمولیت موفق به اخذ دیپلم متوسطه شده باشند.</li>
                                    <li><i class="fas fa-ban"></i> دانش اموزانی که بعد از سن مشمولیت بیش از سه ماه متوالی وقفه تحصیلی غیر موجه داشته و یا اینکه بعد از سن مشمولیت انصراف، اخراج یا ترک تحصیل نموده باشند.</li>
                                </ul>
                            </div>
                            
                            <div class="letter-paragraph">
                                این نامه طبق تقاضای مورخ <strong>${this.toPersianNumbers(data.documentDate || data.issueDate)}</strong> فقط به منظور ارائه به <strong>${forOrganization}</strong> صادر گردیده است.
                            </div>
                        </div>
                    </div>
                    
                    <div class="letter-footer">
                        <div class="signature-section">
                            <div class="signature-name">${data.managerName}</div>
                            <div class="signature-title">مدیر آموزشگاه ${data.schoolName}</div>
                            <div class="signature-line"></div>
                            <div class="signature-label">امضا و مهر</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getTemplateStyles(template, documentType = 'certificate') {
        const baseStyles = `
            .${documentType} {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
                border: 2px solid #1a365d;
                padding: 15mm;
                position: relative;
                min-height: 270mm;
                box-sizing: border-box;
                page-break-after: avoid;
                page-break-inside: avoid;
            }
            
            .${documentType}-header-official {
                text-align: center;
                margin-bottom: 12mm;
                padding-bottom: 4mm;
                border-bottom: 2px solid #1a365d;
            }
            
            .besmellah {
                font-size: 16pt;
                font-weight: bold;
                margin-bottom: 6mm;
                color: #1a365d;
            }
            
            .govt-header {
                font-size: 12pt;
                font-weight: bold;
                margin-bottom: 2mm;
                color: #2d3748;
            }
            
            .education-ministry {
                font-size: 11pt;
                font-weight: bold;
                color: #4a5568;
            }
            
            .${documentType}-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12mm;
                position: relative;
            }
            
            .${documentType}-title-container {
                flex: 1;
                display: flex;
                justify-content: center;
            }
            
            .${documentType}-info-right {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 6px 10px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                text-align: right;
                direction: rtl;
                width: fit-content;
                flex-shrink: 0;
                min-width: 140px;
                margin-right: auto;
            }
            
            .${documentType}-number, .${documentType}-date {
                font-size: 10pt;
                color: #495057;
                margin-bottom: 3px;
                font-weight: 600;
                line-height: 1.3;
                font-family: 'Vazir', sans-serif;
                white-space: nowrap;
            }
            
            .${documentType}-title {
                font-size: 18pt;
                font-weight: 800;
                color: #1a365d;
                text-align: center;
                margin: 0 auto;
            }
            
            .${documentType}-body {
                margin-bottom: 15mm;
            }
            
            .${documentType}-content {
                display: flex;
                gap: 5mm;
                align-items: flex-start;
            }
            
            .student-photo {
                width: 35mm;
                height: 45mm;
                border: 1px solid #1a365d;
                border-radius: 2mm;
                overflow: hidden;
                background: #f8f9fa;
                flex-shrink: 0;
                order: 2;
            }
            
            .student-photo img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .student-photo.placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6c757d;
                font-size: 9pt;
                text-align: center;
                font-family: 'Vazir', sans-serif;
            }
            
            .${documentType}-text {
                flex: 1;
                order: 1;
            }
            
            .${documentType}-paragraph {
                margin-bottom: 6mm;
                text-align: justify;
                font-size: 11pt;
                line-height: 2.2;
            }
            
            .letter-conditions {
                margin: 8mm 0;
                padding-right: 5mm;
            }
            
            .letter-conditions ul {
                list-style-type: none;
                padding-right: 0;
            }
            
            .letter-conditions li {
                margin-bottom: 3mm;
                position: relative;
                padding-right: 5mm;
                font-size: 10pt;
            }
            
            .letter-conditions li::before {
                content: '•';
                color: #1a365d;
                font-weight: bold;
                position: absolute;
                right: 0;
            }
            
            .${documentType}-footer {
                text-align: center;
                margin-top: 15mm;
            }
            
            .signature-section {
                display: inline-block;
                text-align: center;
            }
            
            .signature-name {
                font-weight: bold;
                font-size: 12pt;
                margin-bottom: 2mm;
            }
            
            .signature-title {
                font-size: 10pt;
                color: #475569;
                margin-bottom: 6mm;
            }
            
            .signature-line {
                width: 60mm;
                border-bottom: 1px solid #000;
                margin: 0 auto 2mm;
            }
            
            .signature-label {
                font-size: 9pt;
                color: #6b7280;
            }
            
            strong {
                font-weight: bold;
            }
        `;

        const templateStyles = {
            modern: `
                .${documentType}.modern {
                    border: 3px solid #3b82f6;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                }
                .${documentType}.modern .${documentType}-header-official {
                    border-bottom: 2px solid #3b82f6;
                }
                .${documentType}.modern .besmellah {
                    color: #3b82f6;
                }
            `,
            simple: `
                .${documentType}.simple {
                    border: 1px solid #64748b;
                    background: white;
                }
                .${documentType}.simple .${documentType}-header-official {
                    border-bottom: 1px solid #64748b;
                }
            `,
            official: ''
        };

        return baseStyles + (templateStyles[template] || '');
    }

    getLetterPrintStyles(template) {
        const baseStyles = `
            .letter {
                width: 210mm;
                height: 277mm;
                margin: 0 auto;
                border: 2px solid #1a365d;
                padding: 15mm;
                position: relative;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }
            
            .letter-header-official {
                text-align: center;
                margin-bottom: 8mm;
                padding-bottom: 4mm;
                border-bottom: 2px solid #1a365d;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100px;
            }
            
            .letter-header-official .besmellah,
            .letter-header-official .govt-header,
            .letter-header-official .education-ministry {
                width: 100%;
                text-align: center;
            }
            
            .besmellah {
                font-size: 16pt;
                font-weight: bold;
                margin-bottom: 4mm;
                color: #1a365d;
            }
            
            .govt-header {
                font-size: 12pt;
                font-weight: bold;
                margin-bottom: 2mm;
                color: #2d3748;
            }
            
            .education-ministry {
                font-size: 11pt;
                font-weight: bold;
                color: #4a5568;
            }
            
            .letter-info-compact {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 4px 8px;
                text-align: center;
                direction: rtl;
                font-size: 10pt;
                width: fit-content;
                min-width: 140px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                z-index: 10;
            }
            
            .letter-number, .letter-date {
                font-size: 9pt;
                color: #495057;
                margin-bottom: 1mm;
                font-weight: 600;
                line-height: 1.1;
                font-family: 'Vazir', sans-serif;
                white-space: nowrap;
            }
            
            .letter-header-with-photo {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8mm;
                border-bottom: 2px solid #1a365d;
                padding-bottom: 4mm;
            }
            
            .letter-header-info {
                flex: 1;
            }
            
            .letter-title-container {
                text-align: center;
                margin-bottom: 4mm;
            }
            
            .letter-title {
                font-size: 16pt;
                font-weight: 800;
                color: #1a365d;
                margin: 0;
            }
            
            .student-photo-compact {
                width: 25mm;
                height: 30mm;
                border: 1px solid #1a365d;
                border-radius: 2mm;
                overflow: hidden;
                background: #f8f9fa;
                flex-shrink: 0;
                margin-left: 5mm;
            }
            
            .student-photo-compact img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .student-photo-compact.placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6c757d;
                font-size: 8pt;
                text-align: center;
                font-family: 'Vazir', sans-serif;
            }
            
            .letter-body-compact {
                flex: 1;
                margin-bottom: 8mm;
            }
            
            .letter-content-compact {
                text-align: justify;
            }
            
            .letter-paragraph {
                margin-bottom: 4mm;
                font-size: 11pt;
                line-height: 1.8;
                text-align: justify;
            }
            
            .letter-conditions {
                margin: 6mm 0;
                padding-right: 5mm;
            }
            
            .letter-conditions ul {
                margin: 3mm 0;
                padding-right: 0;
            }
            
            .letter-conditions li {
                margin-bottom: 2mm;
                font-size: 10pt;
                line-height: 1.6;
                padding-right: 5mm;
                position: relative;
            }
            
            .letter-conditions li::before {
                content: '•';
                color: #1a365d;
                font-weight: bold;
                position: absolute;
                right: 0;
                font-size: 10pt;
            }
            
            .letter-footer {
                text-align: center;
                margin-top: 8mm;
                padding-top: 4mm;
                border-top: 1px solid #dee2e6;
            }
            
            .signature-section {
                display: inline-block;
                text-align: center;
            }
            
            .signature-name {
                font-size: 11pt;
                font-weight: bold;
                margin-bottom: 1mm;
            }
            
            .signature-title {
                font-size: 9pt;
                margin-bottom: 3mm;
                color: #6b7280;
            }
            
            .signature-line {
                width: 50mm;
                border-bottom: 1px solid #000;
                margin: 0 auto 1mm;
            }
            
            .signature-label {
                font-size: 8pt;
                color: #6b7280;
            }
            
            strong {
                font-weight: bold;
            }
        `;

        const templateStyles = {
            modern: `
                .letter.modern {
                    border: 3px solid #3b82f6;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                }
                .letter.modern .letter-header-official {
                    border-bottom: 2px solid #3b82f6;
                }
                .letter.modern .besmellah {
                    color: #3b82f6;
                }
            `,
            simple: `
                .letter.simple {
                    border: 1px solid #64748b;
                    background: white;
                }
                .letter.simple .letter-header-official {
                    border-bottom: 1px solid #64748b;
                }
            `,
            official: ''
        };

        return baseStyles + (templateStyles[template] || '');
    }

    newCertificate() {
        if (confirm('آیا از ایجاد سند جدید اطمینان دارید؟ تمام اطلاعات فعلی پاک خواهد شد.')) {
            this.clearForm();
            localStorage.removeItem('certificateSystemData');
            this.switchTab('document-type');
            this.showNotification('فرم جدید برای صدور سند ایجاد شد', 'success');
        }
    }

    clearForm() {
        document.querySelectorAll('input').forEach(input => {
            if (input.id === 'birthDate' || input.id === 'documentDate' || input.id === 'studyStartDate') {
                input.value = '';
            } else {
                input.value = '';
            }
        });
        
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
        });
        
        this.studentImageUrl = null;
        this.uploadedImage = null;
        document.getElementById('imagePreview').innerHTML = `
            <div class="image-placeholder">
                <i class="fas fa-user"></i>
                <span>تصویر دانش‌آموز</span>
            </div>
        `;
        document.getElementById('imageUpload').value = '';
        document.getElementById('field').disabled = false;
        
        this.updateImageStatus('تصویر بارگذاری نشده', 'default');
        this.toggleRemoveImageButton(false);
        this.updatePreview();
        this.updateSystemStatus('فرم جدید آماده است');
    }

    updateSystemStatus(message) {
        const statusElement = document.getElementById('statusText');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
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
        closeBtn.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        });
        
        container.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    showHelp() {
        this.showNotification('برای راهنمایی بیشتر با پشتیبانی فنی تماس بگیرید', 'info');
    }



    
    
}

// راه‌اندازی سیستم
document.addEventListener('DOMContentLoaded', () => {
    window.certificateSystem = new ProfessionalCertificateSystem();
});