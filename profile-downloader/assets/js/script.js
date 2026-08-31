class ClassAlbumSystem {
    constructor() {
        this.excelData = null;
        this.excelHeaders = [];
        this.columnMappings = { nationalCode: null, firstName: null, lastName: null, className: null };
        this.students = [];
        this.studentImages = {};
        this.isDownloading = false;
        
        // ابعاد فیزیکی برگه A4 بر حسب میلی‌متر
        this.A4_WIDTH_MM = 210;
        this.A4_HEIGHT_MM = 297;
        
        // نسبت تصویر دانش‌آموز (عرض:ارتفاع = 3:4)
        this.PHOTO_ASPECT_RATIO = 4 / 3;
        
        this.init();
    }

    toPersianNumber(input) {
        if (input === undefined || input === null || input === '') return '';
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return input.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
    }

    toPersianNumbersInText(text) {
        if (!text) return '';
        return text.replace(/\d+/g, (match) => this.toPersianNumber(match));
    }

    init() {
        console.log("سیستم آلبوم کلاسی راه‌اندازی شد - نسبت تصویر 3:4");
        this.initTabs();
        this.setupEventListeners();
        this.loadFromStorage();
        this.loadSchoolInfo();
        this.setupDesignerToolbar();
        this.setupRangeInputs();
        
        // ریسپانسیو موبایل
        this.initMobileMenu();
        this.adjustForMobile();
        window.addEventListener('resize', () => this.adjustForMobile());
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

    initTabs() {
        const tabButtons = document.querySelectorAll('.nav-item');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                const targetPane = document.getElementById(`tab-${tabId}`);
                
                if (!targetPane) return;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                button.classList.add('active');
                targetPane.classList.add('active');

                if (tabId === 'download-images') {
                    this.updateDownloadStats();
                }
                if (tabId === 'album-design') {
                    this.updateClassSelectOptions();
                    setTimeout(() => this.updateAlbumPreview(), 100);
                }
            });
        });
    }

    setupDesignerToolbar() {
        const toolbarBtns = document.querySelectorAll('.toolbar-btn');
        const elementSettings = document.querySelectorAll('.element-settings');
        
        toolbarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const element = btn.getAttribute('data-element');
                
                toolbarBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                elementSettings.forEach(setting => setting.classList.remove('active'));
                const activeSetting = document.querySelector(`.element-settings[data-element="${element}"]`);
                if (activeSetting) activeSetting.classList.add('active');
            });
        });
    }
    
    setupRangeInputs() {
        const ranges = [
            { rangeId: 'pageMargin', numId: 'pageMarginNum' },
            { rangeId: 'tileGap', numId: 'tileGapNum' },
            { rangeId: 'titleMargin', numId: 'titleMarginNum' },
            { rangeId: 'imageRadius', numId: 'imageRadiusNum' },
            { rangeId: 'nameFontSize', numId: 'nameFontSizeNum' },
            { rangeId: 'titleFontSize', numId: 'titleFontSizeNum' }
        ];
        
        ranges.forEach(item => {
            const rangeInput = document.getElementById(item.rangeId);
            const numInput = document.getElementById(item.numId);
            
            if (rangeInput && numInput) {
                rangeInput.addEventListener('input', () => {
                    numInput.value = rangeInput.value;
                    this.updateAlbumPreview();
                    this.saveToStorage();
                });
                
                numInput.addEventListener('input', () => {
                    let val = parseInt(numInput.value);
                    if (isNaN(val)) val = 0;
                    numInput.value = val;
                    if (rangeInput) rangeInput.value = Math.min(Math.max(val, parseInt(rangeInput.min) || 0), parseInt(rangeInput.max) || 100);
                    this.updateAlbumPreview();
                    this.saveToStorage();
                });
            }
        });
        
        const settingsInputs = [
            'pageBgColor', 'tileBgColor', 'tileShadow', 'imageRadius',
            'nameColor', 'nameFontSize', 'titleColor', 'titleFontSize',
            'showTitle', 'customTitle', 'selectedClass'
        ];
        
        settingsInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    if (id === 'selectedClass') {
                        const countSpan = document.getElementById('selectedClassCount');
                        if (countSpan && this.students) {
                            const selectedClass = el.value;
                            const studentsInClass = this.students.filter(s => s.className === selectedClass);
                            countSpan.innerHTML = this.toPersianNumber(studentsInClass.length);
                        }
                    }
                    this.updateAlbumPreview();
                    this.saveToStorage();
                });
                if (el.type !== 'checkbox' && el.type !== 'select-one') {
                    el.addEventListener('input', () => {
                        this.updateAlbumPreview();
                        this.saveToStorage();
                    });
                }
            }
        });
        
        // تنظیم تصویر گردی کامل
        const imageRoundFull = document.getElementById('imageRoundFull');
        const imageRadius = document.getElementById('imageRadius');
        const imageRadiusNum = document.getElementById('imageRadiusNum');
        
        if (imageRoundFull && imageRadius && imageRadiusNum) {
            let savedRadius = parseInt(imageRadius.value) || 12;
            
            imageRoundFull.addEventListener('change', (e) => {
                if (imageRoundFull.checked) {
                    savedRadius = parseInt(imageRadius.value) || 12;
                    imageRadius.value = 999;
                    imageRadiusNum.value = 999;
                } else {
                    imageRadius.value = savedRadius;
                    imageRadiusNum.value = savedRadius;
                }
                this.updateAlbumPreview();
                this.saveToStorage();
            });
        }
    }

    setupEventListeners() {
        const uploadBtn = document.getElementById('uploadExcelBtn');
        const excelFile = document.getElementById('excelFile');
        if (uploadBtn) uploadBtn.addEventListener('click', () => excelFile?.click());
        if (excelFile) excelFile.addEventListener('change', (e) => this.handleExcelUpload(e));
        
        const downloadSample = document.getElementById('downloadSampleBtn');
        if (downloadSample) downloadSample.addEventListener('click', () => this.downloadSampleFile());
        
        const applyColumns = document.getElementById('applyColumnSettings');
        if (applyColumns) applyColumns.addEventListener('click', () => this.applyColumnSettings());

        const saveSchool = document.getElementById('saveSchoolInfoBtn');
        if (saveSchool) saveSchool.addEventListener('click', () => this.saveSchoolInfo());

        const startDownload = document.getElementById('startDownloadBtn');
        const stopDownload = document.getElementById('stopDownloadBtn');
        const gotoAlbum = document.getElementById('gotoAlbumBtn');
        if (startDownload) startDownload.addEventListener('click', () => this.startDownload());
        if (stopDownload) stopDownload.addEventListener('click', () => this.stopDownload());
        if (gotoAlbum) gotoAlbum.addEventListener('click', () => this.activateTab('album-design'));

        const saveDesign = document.getElementById('saveDesignBtn');
        if (saveDesign) saveDesign.addEventListener('click', () => {
            this.saveToStorage();
            this.showNotification('✅ تنظیمات طراحی ذخیره شد', 'success');
        });
        
        const resetDesign = document.getElementById('resetDesignBtn');
        if (resetDesign) resetDesign.addEventListener('click', () => this.resetDesign());

        const printAlbum = document.getElementById('printAlbumBtn');
        const downloadAlbumPdf = document.getElementById('downloadAlbumPdfBtn');
        if (printAlbum) printAlbum.addEventListener('click', () => this.printAlbum());
        if (downloadAlbumPdf) downloadAlbumPdf.addEventListener('click', () => this.downloadAlbumPDF());

        const homeBtn = document.getElementById('homeBtn');
        const helpBtn = document.getElementById('helpBtn');
        const resetBtn = document.getElementById('resetBtn');
        const gotoSchoolInfo = document.getElementById('gotoSchoolInfoBtn');
        
        if (homeBtn) homeBtn.addEventListener('click', () => window.location.href = '../index.html');
        if (helpBtn) helpBtn.addEventListener('click', () => this.activateTab('help'));
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetSystem());
        if (gotoSchoolInfo) gotoSchoolInfo.addEventListener('click', () => this.activateTab('school-info'));

        const modalClose = document.getElementById('modalClose');
        if (modalClose) modalClose.addEventListener('click', () => this.closeModal());

        // دکمه‌های موبایل در فوتر
        const mobileHomeBtn = document.getElementById('mobileHomeBtn');
        const mobileHelpBtn = document.getElementById('mobileHelpBtn');
        const mobileResetBtn = document.getElementById('mobileResetBtn');
        
        if (mobileHomeBtn) mobileHomeBtn.addEventListener('click', () => window.location.href = '../index.html');
        if (mobileHelpBtn) mobileHelpBtn.addEventListener('click', () => this.activateTab('help'));
        if (mobileResetBtn) mobileResetBtn.addEventListener('click', () => this.resetSystem());
    }
    
    resetDesign() {
        const defaultSettings = {
            pageMargin: 15,
            tileGap: 10,
            titleMargin: 15,
            imageRadius: 12,
            nameFontSize: 13,
            titleFontSize: 24,
            pageBgColor: '#ffffff',
            tileBgColor: '#f8fafc',
            tileShadow: 'sm',
            nameColor: '#1e293b',
            titleColor: '#0ea5e9',
            showTitle: true,
            customTitle: ''
        };
        
        Object.entries(defaultSettings).forEach(([key, value]) => {
            const el = document.getElementById(key);
            if (el) {
                if (el.type === 'checkbox') el.checked = value;
                else if (el.type === 'range') el.value = value;
                else el.value = value;
            }
            const numEl = document.getElementById(key + 'Num');
            if (numEl && typeof value === 'number') numEl.value = value;
        });
        
        // ریست کردن تیک گردی کامل
        const imageRoundFull = document.getElementById('imageRoundFull');
        if (imageRoundFull) imageRoundFull.checked = false;
        
        this.updateAlbumPreview();
        this.saveToStorage();
        this.showNotification('✅ طراحی به حالت بهینه بازنشانی شد', 'success');
    }

    activateTab(tabName) {
        const tabButton = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
        if (tabButton) tabButton.click();
    }

    handleExcelUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const fileNameSpan = document.getElementById('excelFileName');
        if (fileNameSpan) fileNameSpan.innerHTML = `فایل انتخاب شده: ${file.name}`;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                this.excelHeaders = jsonData[0] || [];
                this.excelData = [];
                
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (row && row.some(cell => cell !== undefined && cell !== null && cell !== '')) {
                        const rowData = {};
                        this.excelHeaders.forEach((header, index) => {
                            rowData[header] = row[index] !== undefined ? row[index].toString().trim() : '';
                        });
                        this.excelData.push(rowData);
                    }
                }

                const totalRecords = document.getElementById('totalRecords');
                if (totalRecords) totalRecords.innerHTML = this.toPersianNumber(this.excelData.length);
                
                this.displayColumnSelector();
                this.previewExcelData();
                this.updateClassFilters();
                this.showNotification(`✅ فایل بارگذاری شد. ${this.excelData.length} رکورد`, 'success');
            } catch (error) {
                console.error('Excel upload error:', error);
                this.showNotification('❌ خطا در خواندن فایل', 'error');
            }
        };
        reader.readAsBinaryString(file);
        event.target.value = '';
    }

    displayColumnSelector() {
        const columnSelector = document.getElementById('columnSelector');
        if (columnSelector) columnSelector.style.display = 'block';
        
        const containers = {
            nationalCodeColumns: 'nationalCode',
            firstNameColumns: 'firstName',
            lastNameColumns: 'lastName',
            classColumns: 'className'
        };
        
        Object.keys(containers).forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = '';
        });
        
        this.excelHeaders.forEach(header => {
            if (header && header.trim() !== '') {
                Object.entries(containers).forEach(([containerId, type]) => {
                    const badge = document.createElement('span');
                    badge.className = 'column-badge';
                    badge.textContent = header;
                    badge.onclick = () => {
                        document.querySelectorAll(`#${containerId} .column-badge`).forEach(b => b.classList.remove('selected'));
                        badge.classList.add('selected');
                        this.columnMappings[type] = header;
                    };
                    const container = document.getElementById(containerId);
                    if (container) container.appendChild(badge);
                });
            }
        });
    }

    applyColumnSettings() {
        if (!this.columnMappings.nationalCode && !this.columnMappings.firstName && !this.columnMappings.lastName) {
            this.showNotification('❌ لطفاً حداقل ستون کد ملی یا نام را انتخاب کنید', 'warning');
            return;
        }

        this.students = this.excelData.map((row, index) => {
            let nationalCode = '';
            if (this.columnMappings.nationalCode) {
                nationalCode = row[this.columnMappings.nationalCode] || '';
                nationalCode = nationalCode.toString().replace(/\D/g, '');
            }
            return {
                id: index,
                nationalCode: nationalCode,
                firstName: this.columnMappings.firstName ? (row[this.columnMappings.firstName] || '') : '',
                lastName: this.columnMappings.lastName ? (row[this.columnMappings.lastName] || '') : '',
                className: this.columnMappings.className ? (row[this.columnMappings.className] || '') : ''
            };
        }).filter(s => s.firstName || s.lastName || s.nationalCode);
        
        this.showNotification(`✅ ${this.students.length} دانش‌آموز ذخیره شد`, 'success');
        
        const totalStudents = document.getElementById('totalStudentsCount');
        if (totalStudents) totalStudents.innerHTML = this.toPersianNumber(this.students.length);
        
        this.updateClassFilters();
        this.updateClassSelectOptions();
        this.activateTab('school-info');
    }

    updateClassSelectOptions() {
        const select = document.getElementById('selectedClass');
        if (!select) return;
        
        if (!this.students || !this.students.length) {
            select.innerHTML = '<option value="">-- ابتدا داده‌ها را بارگذاری کنید --</option>';
            return;
        }
        
        const classes = [...new Set(this.students.map(s => s.className).filter(c => c))];
        select.innerHTML = '<option value="">-- انتخاب کلاس --</option>';
        classes.forEach(c => {
            select.innerHTML += `<option value="${c}">${c}</option>`;
        });
    }

    updateClassFilters() {
        if (!this.students) return;
        const classes = [...new Set(this.students.map(s => s.className).filter(c => c))];
        
        ['classFilter', 'downloadClassFilter'].forEach(id => {
            const filter = document.getElementById(id);
            if (filter) {
                filter.innerHTML = '<option value="all">همه کلاس‌ها</option>';
                classes.forEach(c => {
                    filter.innerHTML += `<option value="${c}">${c}</option>`;
                });
            }
        });
    }

    previewExcelData() {
        const previewDiv = document.getElementById('excelPreview');
        const table = document.getElementById('excelDataTable');
        
        if (!this.excelData || !this.excelData.length) {
            if (previewDiv) previewDiv.style.display = 'none';
            return;
        }
        
        let html = '<thead><tr>';
        this.excelHeaders.forEach(h => { if (h) html += `<th>${h.length > 20 ? h.substring(0,20)+'...' : h}</th>`; });
        html += '</tr></thead><tbody>';
        
        for (let i = 0; i < Math.min(8, this.excelData.length); i++) {
            html += '<tr>';
            this.excelHeaders.forEach(h => {
                if (h) {
                    let cell = this.excelData[i][h] || '';
                    cell = cell.length > 25 ? cell.substring(0,25)+'...' : cell;
                    html += `<td>${this.toPersianNumbersInText(cell)}</table>`;
                }
            });
            html += '</tr>';
        }
        html += '</tbody>';
        
        if (table) table.innerHTML = html;
        if (previewDiv) previewDiv.style.display = 'block';
    }

    downloadSampleFile() {
        const sample = [
            ['کد ملی', 'نام', 'نام خانوادگی', 'کلاس'],
            ['1234567890', 'امیرعلی', 'آزادی', 'دهم ریاضی'],
            ['2345678901', 'محمدحسین', 'کریمی', 'دهم تجربی'],
            ['3456789012', 'سارا', 'محمدی', 'دهم ریاضی'],
            ['4567890123', 'زهرا', 'حسینی', 'یازدهم تجربی'],
            ['5678901234', 'علی', 'رضایی', 'دهم ریاضی'],
            ['6789012345', 'مریم', 'کریمی', 'یازدهم تجربی'],
            ['7890123456', 'رضا', 'احمدی', 'دهم ریاضی']
        ];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(sample);
        XLSX.utils.book_append_sheet(wb, ws, 'دانش‌آموزان');
        XLSX.writeFile(wb, 'sample-students.xlsx');
        this.showNotification('✅ فایل نمونه دانلود شد', 'success');
    }

    saveSchoolInfo() {
        const province = document.getElementById('provinceCode').value;
        const area = document.getElementById('areaCode').value;
        const school = document.getElementById('schoolCode').value;
        
        if (!province || !area || !school) {
            this.showNotification('❌ لطفاً تمام کدها را وارد کنید', 'warning');
            return;
        }
        
        localStorage.setItem('schoolInfo', JSON.stringify({ province, area, school }));
        this.showNotification('✅ اطلاعات آموزشگاه ذخیره شد', 'success');
        this.activateTab('download-images');
    }

    loadSchoolInfo() {
        try {
            const saved = localStorage.getItem('schoolInfo');
            if (saved) {
                const data = JSON.parse(saved);
                const provinceInput = document.getElementById('provinceCode');
                const areaInput = document.getElementById('areaCode');
                const schoolInput = document.getElementById('schoolCode');
                if (provinceInput) provinceInput.value = data.province || '16';
                if (areaInput) areaInput.value = data.area || '1670';
                if (schoolInput) schoolInput.value = data.school || '54130808';
            }
        } catch(e) {}
    }

    async startDownload() {
        if (!this.students || !this.students.length) {
            this.showNotification('❌ ابتدا فایل Excel را آپلود کنید', 'warning');
            this.activateTab('excel-upload');
            return;
        }
        
        const province = document.getElementById('provinceCode').value.trim();
        const area = document.getElementById('areaCode').value.trim();
        const school = document.getElementById('schoolCode').value.trim();
        
        if (!province || !area || !school) {
            this.showNotification('❌ کدهای آموزشگاه را کامل کنید', 'warning');
            this.activateTab('school-info');
            return;
        }
        
        const classFilter = document.getElementById('downloadClassFilter').value;
        let studentsToDownload = this.students;
        if (classFilter !== 'all') studentsToDownload = this.students.filter(s => s.className === classFilter);
        
        const studentsWithCode = studentsToDownload.filter(s => s.nationalCode && s.nationalCode.length >= 8);
        
        if (!studentsWithCode.length) {
            this.showNotification('❌ هیچ کد ملی معتبری یافت نشد', 'warning');
            return;
        }
        
        const concurrency = parseInt(document.getElementById('concurrency').value) || 3;
        
        this.showNotification(`⏳ شروع دانلود ${studentsWithCode.length} تصویر...`, 'info');
        this.showProgress(true);
        this.isDownloading = true;
        
        const startBtn = document.getElementById('startDownloadBtn');
        const stopBtn = document.getElementById('stopDownloadBtn');
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        
        let success = 0, error = 0;
        const chunks = this.chunkArray(studentsWithCode, concurrency);
        
        for (const chunk of chunks) {
            if (!this.isDownloading) break;
            await Promise.all(chunk.map(async (student) => {
                const result = await this.downloadSingleImage(student, province, area, school);
                if (result.success) {
                    this.studentImages[student.nationalCode] = result.imageUrl;
                    success++;
                } else {
                    error++;
                }
                this.updateProgress(success + error, studentsWithCode.length, success, error);
            }));
        }
        
        this.isDownloading = false;
        this.showProgress(false);
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        
        this.updateDownloadStats();
        this.updateAlbumPreview();
        
        this.showNotification(`✅ دانلود: ${success} موفق، ${error} ناموفق`, error ? 'warning' : 'success');
    }

    async downloadSingleImage(student, province, area, school) {
        const url = `proxy.php?code=${student.nationalCode}&province=${province}&area=${area}&school=${school}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error();
            const blob = await response.blob();
            if (blob.size < 1000) throw new Error();
            return { success: true, imageUrl: URL.createObjectURL(blob) };
        } catch {
            return { success: false, imageUrl: null };
        }
    }

    stopDownload() {
        this.isDownloading = false;
        this.showNotification('⏹️ دانلود متوقف شد', 'warning');
        const startBtn = document.getElementById('startDownloadBtn');
        const stopBtn = document.getElementById('stopDownloadBtn');
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        this.showProgress(false);
    }

    showProgress(show) {
        const container = document.getElementById('progressContainer');
        if (container) container.style.display = show ? 'block' : 'none';
    }

    updateProgress(current, total, success, error) {
        const percent = Math.round((current / total) * 100);
        const fill = document.getElementById('progressFill');
        const percentSpan = document.getElementById('progressPercent');
        const successSpan = document.getElementById('progressSuccess');
        const errorSpan = document.getElementById('progressError');
        const pendingSpan = document.getElementById('progressPending');
        
        if (fill) fill.style.width = percent + '%';
        if (percentSpan) percentSpan.innerHTML = this.toPersianNumber(percent) + '%';
        if (successSpan) successSpan.innerHTML = this.toPersianNumber(success);
        if (errorSpan) errorSpan.innerHTML = this.toPersianNumber(error);
        if (pendingSpan) pendingSpan.innerHTML = this.toPersianNumber(total - current);
    }

    updateDownloadStats() {
        const downloaded = Object.keys(this.studentImages).length;
        const failed = this.students.filter(s => s.nationalCode && !this.studentImages[s.nationalCode]).length;
        const downloadedSpan = document.getElementById('downloadedCount');
        const failedSpan = document.getElementById('failedCount');
        if (downloadedSpan) downloadedSpan.innerHTML = this.toPersianNumber(downloaded);
        if (failedSpan) failedSpan.innerHTML = this.toPersianNumber(failed);
    }

    chunkArray(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
        return chunks;
    }

    getPhotoUrl(student) {
        if (this.studentImages[student.nationalCode]) return this.studentImages[student.nationalCode];
        if (student.nationalCode && student.nationalCode.length >= 8) {
            const province = document.getElementById('provinceCode')?.value || '16';
            const area = document.getElementById('areaCode')?.value || '1670';
            const school = document.getElementById('schoolCode')?.value || '54130808';
            return `proxy.php?code=${student.nationalCode}&province=${province}&area=${area}&school=${school}`;
        }
        return null;
    }

    getSettings() {
        const imageRadiusEl = document.getElementById('imageRadius');
        let imageRadiusValue = parseInt(imageRadiusEl?.value) || 12;
        if (imageRadiusValue > 200) imageRadiusValue = 12;
        
        return {
            pageMargin: parseInt(document.getElementById('pageMargin')?.value) || 15,
            tileGap: parseInt(document.getElementById('tileGap')?.value) || 10,
            titleMargin: parseInt(document.getElementById('titleMargin')?.value) || 15,
            imageRadius: imageRadiusValue,
            nameFontSize: parseInt(document.getElementById('nameFontSize')?.value) || 13,
            titleFontSize: parseInt(document.getElementById('titleFontSize')?.value) || 24,
            pageBgColor: document.getElementById('pageBgColor')?.value || '#ffffff',
            tileBgColor: document.getElementById('tileBgColor')?.value || '#f8fafc',
            tileShadow: document.getElementById('tileShadow')?.value || 'sm',
            nameColor: document.getElementById('nameColor')?.value || '#1e293b',
            titleColor: document.getElementById('titleColor')?.value || '#0ea5e9',
            showTitle: document.getElementById('showTitle')?.checked !== false,
            customTitle: document.getElementById('customTitle')?.value || '',
            selectedClass: document.getElementById('selectedClass')?.value || ''
        };
    }

    calculateOptimalLayout(studentCount, settings) {
        const margin = settings.pageMargin;
        const gap = settings.tileGap;
        const titleMargin = settings.titleMargin;
        const showTitle = settings.showTitle;
        
        const availableWidth = this.A4_WIDTH_MM - (margin * 2);
        
        let availableHeight = this.A4_HEIGHT_MM - (margin * 2);
        if (showTitle) {
            const titleHeight = (settings.titleFontSize * 0.264583) + titleMargin;
            availableHeight -= titleHeight;
        }
        
        let bestSolution = null;
        let bestCoverage = 0;
        
        for (let cols = 1; cols <= Math.min(studentCount, 6); cols++) {
            const rows = Math.ceil(studentCount / cols);
            const tileWidth = (availableWidth - (gap * (cols - 1))) / cols;
            const tileHeight = tileWidth * this.PHOTO_ASPECT_RATIO;
            const totalUsedHeight = (tileHeight * rows) + (gap * (rows - 1));
            
            if (totalUsedHeight <= availableHeight + 1) {
                const totalUsedWidth = (tileWidth * cols) + (gap * (cols - 1));
                const coverage = (totalUsedWidth * totalUsedHeight) / (availableWidth * availableHeight) * 100;
                
                if (coverage > bestCoverage) {
                    bestCoverage = coverage;
                    bestSolution = {
                        columns: cols,
                        rows: rows,
                        tileWidth: tileWidth,
                        tileHeight: tileHeight,
                        gap: gap,
                        margin: margin,
                        coverage: coverage,
                        imageWidthMM: tileWidth - 6,
                        imageHeightMM: (tileWidth - 6) * this.PHOTO_ASPECT_RATIO
                    };
                }
            }
        }
        
        if (!bestSolution) {
            const cols = Math.min(4, studentCount);
            const rows = Math.ceil(studentCount / cols);
            const tileWidth = (availableWidth - (gap * (cols - 1))) / cols;
            const tileHeight = tileWidth * this.PHOTO_ASPECT_RATIO;
            
            bestSolution = {
                columns: cols,
                rows: rows,
                tileWidth: tileWidth,
                tileHeight: tileHeight,
                gap: gap,
                margin: margin,
                coverage: 0,
                imageWidthMM: tileWidth - 6,
                imageHeightMM: (tileWidth - 6) * this.PHOTO_ASPECT_RATIO
            };
        }
        
        const imageWidthPx = Math.floor(bestSolution.imageWidthMM * 3.78);
        const imageHeightPx = Math.floor(bestSolution.imageHeightMM * 3.78);
        
        const finalImageWidth = Math.min(250, Math.max(80, imageWidthPx));
        const finalImageHeight = Math.min(330, Math.max(107, imageHeightPx));
        
        return {
            rows: bestSolution.rows,
            columns: bestSolution.columns,
            tileWidth: bestSolution.tileWidth,
            tileHeight: bestSolution.tileHeight,
            imageWidth: finalImageWidth,
            imageHeight: finalImageHeight,
            gap: bestSolution.gap,
            margin: bestSolution.margin,
            coverage: bestSolution.coverage,
            availableWidth: availableWidth,
            availableHeight: availableHeight,
            aspectRatio: this.PHOTO_ASPECT_RATIO
        };
    }

    renderAlbumPage(className, students) {
        const settings = this.getSettings();
        const layout = this.calculateOptimalLayout(students.length, settings);
        
        let pageTitle = className;
        if (settings.customTitle && settings.customTitle.trim() !== '') {
            pageTitle = settings.customTitle;
        }
        
        const shadowValue = {
            'none': 'none',
            'sm': '0 2px 8px rgba(0,0,0,0.06)',
            'md': '0 4px 12px rgba(0,0,0,0.1)'
        }[settings.tileShadow] || '0 2px 8px rgba(0,0,0,0.06)';
        
        const pageStyle = `background: ${settings.pageBgColor}; padding: ${layout.margin}mm; width: 100%; min-height: 297mm; box-sizing: border-box;`;
        const titleStyle = `text-align: center; margin-bottom: ${settings.titleMargin}mm; font-size: ${settings.titleFontSize}px; font-weight: bold; color: ${settings.titleColor}; padding-bottom: 5mm; border-bottom: 3px solid ${settings.titleColor}; display: inline-block; width: auto;`;
        const gridStyle = `display: grid; grid-template-columns: repeat(${layout.columns}, ${layout.tileWidth}mm); gap: ${layout.gap}mm; justify-content: center; align-items: start;`;
        const tileStyle = `background: ${settings.tileBgColor}; border-radius: 10px; box-shadow: ${shadowValue}; width: ${layout.tileWidth}mm; overflow: hidden; text-align: center;`;
        const imageStyle = `width: ${layout.imageWidth}px; height: ${layout.imageHeight}px; object-fit: cover; object-position: center; border-radius: ${settings.imageRadius}px; margin-top: 6px; border: 2px solid #e2e8f0; cursor: pointer; display: block; margin-left: auto; margin-right: auto;`;
        const noImageStyle = `width: ${layout.imageWidth}px; height: ${layout.imageHeight}px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: ${settings.imageRadius}px; margin-top: 6px; margin-left: auto; margin-right: auto; font-size: 32px; color: #94a3b8;`;
        const nameStyle = `padding: 6px 4px 8px 4px; font-size: ${settings.nameFontSize}px; font-weight: 500; color: ${settings.nameColor}; text-align: center;`;
        
        let html = `<div class="album-page" style="${pageStyle}">`;
        
        if (settings.showTitle) {
            html += `<div style="text-align: center;"><div style="${titleStyle}">${this.toPersianNumbersInText(pageTitle)}</div></div>`;
        }
        
        html += `<div class="students-grid" style="${gridStyle}">`;
        
        students.forEach(student => {
            const fullName = `${student.firstName} ${student.lastName}`.trim();
            const photoUrl = this.getPhotoUrl(student);
            
            html += `<div class="student-card" style="${tileStyle}">`;
            html += `<div class="student-photo">`;
            
            if (photoUrl) {
                html += `<img src="${photoUrl}" style="${imageStyle}" onclick="classAlbumSystem.viewImage('${photoUrl}')">`;
            } else {
                html += `<div style="${noImageStyle}"><i class="fas fa-user-graduate"></i></div>`;
            }
            
            html += `</div>`;
            html += `<div class="student-name" style="${nameStyle}">${this.toPersianNumbersInText(fullName)}</div>`;
            html += `</div>`;
        });
        
        html += `</div></div>`;
        
        return html;
    }

    updateAlbumPreview() {
        const previewContainer = document.getElementById('albumPreviewContent');
        const layoutInfoSpan = document.getElementById('layoutInfo');
        
        if (!previewContainer) return;
        
        const settings = this.getSettings();
        const selectedClass = settings.selectedClass;
        
        if (!this.students || !this.students.length || !selectedClass) {
            previewContainer.innerHTML = '<div class="empty-preview"><i class="fas fa-images"></i><p>لطفاً ابتدا فایل Excel را آپلود، تصاویر را دانلود و کلاس مورد نظر را انتخاب کنید</p></div>';
            if (layoutInfoSpan) layoutInfoSpan.innerHTML = 'لطفاً کلاس مورد نظر را انتخاب کنید';
            return;
        }
        
        const studentsInClass = this.students.filter(s => s.className === selectedClass);
        
        if (!studentsInClass.length) {
            previewContainer.innerHTML = '<div class="empty-preview"><i class="fas fa-users-slash"></i><p>هیچ دانش‌آموزی در این کلاس یافت نشد</p></div>';
            if (layoutInfoSpan) layoutInfoSpan.innerHTML = 'هیچ دانش‌آموزی در این کلاس وجود ندارد';
            return;
        }
        
        const layout = this.calculateOptimalLayout(studentsInClass.length, settings);
        
        if (layoutInfoSpan) {
            layoutInfoSpan.innerHTML = `📐 ${studentsInClass.length} نفر → ${layout.rows} ردیف × ${layout.columns} ستون | ابعاد کاشی: ${layout.tileWidth.toFixed(1)} × ${layout.tileHeight.toFixed(1)} mm | نسبت تصویر: 3:4 | پوشش فضا: ${layout.coverage.toFixed(0)}%`;
        }
        
        const previewStudents = studentsInClass.slice(0, 12);
        const previewLayout = this.calculateOptimalLayout(Math.min(previewStudents.length, 12), settings);
        
        const shadowValue = {
            'none': 'none',
            'sm': '0 2px 8px rgba(0,0,0,0.06)',
            'md': '0 4px 12px rgba(0,0,0,0.1)'
        }[settings.tileShadow] || '0 2px 8px rgba(0,0,0,0.06)';
        
        const maxPreviewWidth = 700;
        const availablePreviewWidth = maxPreviewWidth - (layout.margin * 2);
        const previewTileWidth = Math.min(150, (availablePreviewWidth / previewLayout.columns) - previewLayout.gap);
        const previewImageWidth = previewTileWidth - 12;
        const previewImageHeight = previewImageWidth * this.PHOTO_ASPECT_RATIO;
        
        let previewHtml = `<div style="background: ${settings.pageBgColor}; border-radius: 16px; padding: 15px; max-width: 100%; margin: 0 auto;">`;
        
        if (settings.showTitle) {
            let title = selectedClass;
            if (settings.customTitle && settings.customTitle.trim() !== '') {
                title = settings.customTitle;
            }
            previewHtml += `<div style="text-align: center; margin-bottom: 12px;"><div style="font-size: ${Math.min(18, settings.titleFontSize)}px; font-weight: bold; color: ${settings.titleColor}; padding-bottom: 5px; border-bottom: 2px solid ${settings.titleColor}; display: inline-block;">پیش‌نمایش: ${this.toPersianNumbersInText(title)}</div></div>`;
        }
        
        previewHtml += `<div style="display: grid; grid-template-columns: repeat(${Math.min(previewLayout.columns, 3)}, 1fr); gap: 8px; justify-items: center;">`;
        
        previewStudents.forEach(student => {
            const fullName = `${student.firstName} ${student.lastName}`.trim();
            const photoUrl = this.getPhotoUrl(student);
            
            previewHtml += `<div style="background: ${settings.tileBgColor}; border-radius: 8px; box-shadow: ${shadowValue}; width: 100%; text-align: center; overflow: hidden;">`;
            previewHtml += `<div style="display: flex; justify-content: center; padding-top: 5px;">`;
            
            if (photoUrl) {
                previewHtml += `<img src="${photoUrl}" style="width: ${previewImageWidth}px; height: ${previewImageHeight}px; object-fit: cover; border-radius: ${Math.min(6, settings.imageRadius)}px; border: 1px solid #e2e8f0;">`;
            } else {
                previewHtml += `<div style="width: ${previewImageWidth}px; height: ${previewImageHeight}px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: ${Math.min(6, settings.imageRadius)}px;"><i class="fas fa-user-graduate" style="font-size: 24px; color: #94a3b8;"></i></div>`;
            }
            
            previewHtml += `</div>`;
            previewHtml += `<div style="padding: 4px 2px 6px 2px; font-size: ${Math.min(10, settings.nameFontSize)}px; color: ${settings.nameColor};">${this.toPersianNumbersInText(fullName.length > 15 ? fullName.substring(0, 12) + '...' : fullName)}</div>`;
            previewHtml += `</div>`;
        });
        
        previewHtml += `</div>`;
        
        if (previewStudents.length < studentsInClass.length) {
            previewHtml += `<div class="form-hint" style="text-align: center; margin-top: 12px; background: rgba(0,0,0,0.05); padding: 6px; border-radius: 8px;">+ ${studentsInClass.length - previewStudents.length} نفر دیگر در آلبوم اصلی نمایش داده می‌شوند</div>`;
        }
        
        previewHtml += `<div class="form-hint" style="text-align: center; margin-top: 12px; font-size: 11px; background: #e2e8f0; padding: 6px; border-radius: 8px;">📊 مجموع دانش‌آموزان کلاس: <strong>${studentsInClass.length}</strong> نفر | چیدمان بهینه: <strong>${layout.rows} × ${layout.columns}</strong> | نسبت تصویر: <strong>3:4</strong> | پوشش <strong>${layout.coverage.toFixed(0)}%</strong> از برگه</div>`;
        previewHtml += `</div>`;
        
        previewContainer.innerHTML = previewHtml;
    }

    generatePrintHTML() {
        const settings = this.getSettings();
        const selectedClass = settings.selectedClass;
        
        if (!this.students || !this.students.length || !selectedClass) {
            return '<html><body><p>خطا: اطلاعات کافی وجود ندارد</p></body></html>';
        }
        
        const studentsInClass = this.students.filter(s => s.className === selectedClass);
        const albumHtml = this.renderAlbumPage(selectedClass, studentsInClass);
        
        return `<!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>آلبوم کلاسی - ${selectedClass}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazir', 'Segoe UI', sans-serif; }
                body { background: white; direction: rtl; }
                @page { size: A4 portrait; margin: 0; }
                @media print { 
                    body { margin: 0; padding: 0; } 
                    .album-page { page-break-after: avoid; }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
                .album-page {
                    background: white;
                    width: 100%;
                    min-height: 297mm;
                    position: relative;
                    box-sizing: border-box;
                }
                .student-card {
                    transition: none;
                    break-inside: avoid;
                }
                .students-grid {
                    page-break-inside: avoid;
                }
            </style>
        </head>
        <body>${albumHtml}</body>
        </html>`;
    }

    printAlbum() {
        if (!this.students || !this.students.length) {
            this.showNotification('❌ ابتدا فایل Excel را آپلود کنید', 'warning');
            this.activateTab('excel-upload');
            return;
        }
        
        const selectedClass = document.getElementById('selectedClass')?.value;
        if (!selectedClass) {
            this.showNotification('❌ لطفاً کلاس مورد نظر را انتخاب کنید', 'warning');
            this.activateTab('album-design');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(this.generatePrintHTML());
        printWindow.document.close();
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                printWindow.onafterprint = () => printWindow.close();
            }, 300);
        };
    }

    async downloadAlbumPDF() {
        if (!this.students || !this.students.length) {
            this.showNotification('❌ ابتدا فایل Excel را آپلود کنید', 'warning');
            this.activateTab('excel-upload');
            return;
        }
        
        const selectedClass = document.getElementById('selectedClass')?.value;
        if (!selectedClass) {
            this.showNotification('❌ لطفاً کلاس مورد نظر را انتخاب کنید', 'warning');
            this.activateTab('album-design');
            return;
        }
        
        this.showNotification('⏳ در حال ایجاد PDF آلبوم...', 'info');
        
        const printHtml = this.generatePrintHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = printHtml;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        try {
            await html2pdf().set({
                margin: [0, 0, 0, 0],
                filename: `class-album-${selectedClass}-${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(tempDiv).save();
            this.showNotification('✅ PDF آلبوم ایجاد شد', 'success');
        } catch(e) {
            console.error('PDF error:', e);
            this.showNotification('❌ خطا در ایجاد PDF', 'error');
        }
        
        document.body.removeChild(tempDiv);
    }

    resetSystem() {
        if (confirm('آیا از شروع مجدد اطمینان دارید؟ تمام اطلاعات پاک خواهد شد.')) {
            this.excelData = null;
            this.excelHeaders = [];
            this.columnMappings = { nationalCode: null, firstName: null, lastName: null, className: null };
            this.students = [];
            this.studentImages = {};
            
            const fileNameSpan = document.getElementById('excelFileName');
            const columnSelector = document.getElementById('columnSelector');
            const excelPreview = document.getElementById('excelPreview');
            const albumPreview = document.getElementById('albumPreviewContent');
            const classSelect = document.getElementById('selectedClass');
            
            if (fileNameSpan) fileNameSpan.innerHTML = '';
            if (columnSelector) columnSelector.style.display = 'none';
            if (excelPreview) excelPreview.style.display = 'none';
            if (albumPreview) albumPreview.innerHTML = '<div class="empty-preview"><i class="fas fa-images"></i><p>لطفاً ابتدا فایل Excel را آپلود کنید</p></div>';
            if (classSelect) classSelect.innerHTML = '<option value="">-- ابتدا داده‌ها را بارگذاری کنید --</option>';
            
            // ریست تنظیمات طراحی
            this.resetDesign();
            
            this.activateTab('excel-upload');
            this.showNotification('✅ سیستم ریست شد', 'success');
        }
    }

    saveToStorage() {
        const settings = {
            pageMargin: document.getElementById('pageMargin')?.value || '15',
            tileGap: document.getElementById('tileGap')?.value || '10',
            titleMargin: document.getElementById('titleMargin')?.value || '15',
            imageRadius: document.getElementById('imageRadius')?.value || '12',
            nameFontSize: document.getElementById('nameFontSize')?.value || '13',
            titleFontSize: document.getElementById('titleFontSize')?.value || '24',
            pageBgColor: document.getElementById('pageBgColor')?.value || '#ffffff',
            tileBgColor: document.getElementById('tileBgColor')?.value || '#f8fafc',
            tileShadow: document.getElementById('tileShadow')?.value || 'sm',
            nameColor: document.getElementById('nameColor')?.value || '#1e293b',
            titleColor: document.getElementById('titleColor')?.value || '#0ea5e9',
            showTitle: document.getElementById('showTitle')?.checked !== false,
            customTitle: document.getElementById('customTitle')?.value || '',
            concurrency: document.getElementById('concurrency')?.value || '3'
        };
        localStorage.setItem('classAlbumSystem', JSON.stringify(settings));
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('classAlbumSystem');
            if (saved) {
                const data = JSON.parse(saved);
                Object.entries(data).forEach(([key, value]) => {
                    const el = document.getElementById(key);
                    if (el) {
                        if (el.type === 'checkbox') el.checked = value;
                        else if (el.type === 'range') el.value = value;
                        else el.value = value;
                    }
                    const numEl = document.getElementById(key + 'Num');
                    if (numEl && typeof value === 'number') numEl.value = value;
                    else if (numEl && !isNaN(parseInt(value))) numEl.value = parseInt(value);
                });
            } else {
                this.resetDesign();
            }
        } catch(e) {
            console.error("Error loading settings:", e);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
        const icon = icons[type] || 'info-circle';
        notification.innerHTML = `<i class="fas fa-${icon}"></i><div>${message}</div><button class="notification-close" onclick="this.parentElement.remove()">&times;</button>`;
        container.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    viewImage(url) {
        if (url) {
            const modalImg = document.getElementById('modalImage');
            const modal = document.getElementById('imageModal');
            if (modalImg) modalImg.src = url;
            if (modal) modal.classList.add('active');
        }
    }

    closeModal() {
        const modal = document.getElementById('imageModal');
        if (modal) modal.classList.remove('active');
    }
}

let classAlbumSystem;
document.addEventListener('DOMContentLoaded', () => {
    classAlbumSystem = new ClassAlbumSystem();
    window.classAlbumSystem = classAlbumSystem;
});