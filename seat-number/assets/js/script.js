class SeatNumberSystem {
    constructor() {
        this.excelData = null;
        this.excelHeaders = [];
        this.columnMappings = { nationalCode: null, firstName: null, lastName: null, className: null };
        this.students = [];
        this.seatCards = [];
        this.studentImages = {};
        this.isDownloading = false;
        this.savedImageBorderRadius = 0;
        
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
        this.initTabs();
        this.setupEventListeners();
        this.loadFromStorage();
        this.loadSchoolInfo();
        this.setupNumberingTypeListener();
        this.setupDesignerToolbar();
        this.setupRangeInputs();
        this.updateLivePreview();
        this.adjustPreviewSize();
        window.addEventListener('resize', () => this.adjustPreviewSize());
        
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

    adjustPreviewSize() {
        const wrapper = document.getElementById('livePreviewWrapper');
        const container = document.getElementById('livePreviewCard');
        if (wrapper && container) {
            const maxWidth = wrapper.clientWidth - 40;
            const maxHeight = wrapper.clientHeight - 40;
            const targetWidth = Math.min(maxWidth, maxHeight / 0.707);
            if (targetWidth > 0) {
                container.style.maxWidth = targetWidth + 'px';
            }
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
                if (tabId === 'print') {
                    this.updatePrintStats();
                }
                if (tabId === 'card-design') {
                    setTimeout(() => {
                        this.updateLivePreview();
                        this.adjustPreviewSize();
                    }, 100);
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
        
        const posBtns = document.querySelectorAll('.pos-btn');
        const imagePositionInput = document.getElementById('imagePosition');
        posBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const pos = btn.getAttribute('data-pos');
                posBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (imagePositionInput) imagePositionInput.value = pos;
                this.updateLivePreview();
                this.saveToStorage();
            });
        });
        
        this.setupRangeInputs();
    }
    
    setupRangeInputs() {
        const ranges = [
            { rangeId: 'cardBorderWidth', numId: 'cardBorderWidthNum' },
            { rangeId: 'cardBorderRadius', numId: 'cardBorderRadiusNum' },
            { rangeId: 'imageWidth', numId: 'imageWidthNum' },
            { rangeId: 'imageBorderRadius', numId: 'imageBorderRadiusNum' },
            { rangeId: 'imageBorderWidth', numId: 'imageBorderWidthNum' },
            { rangeId: 'imageOpacity', numId: 'imageOpacityNum' },
            { rangeId: 'numberFontSize', numId: 'numberFontSizeNum' },
            { rangeId: 'numberBorderRadius', numId: 'numberBorderRadiusNum' },
            { rangeId: 'numberPadding', numId: 'numberPaddingNum' },
            { rangeId: 'nameFontSize', numId: 'nameFontSizeNum' },
            { rangeId: 'classFontSize', numId: 'classFontSizeNum' },
            { rangeId: 'cardPadding', numId: 'cardPaddingNum' },
            { rangeId: 'gapTextImage', numId: 'gapTextImageNum' },
            { rangeId: 'gapNumberName', numId: 'gapNumberNameNum' },
            { rangeId: 'gapNameClass', numId: 'gapNameClassNum' }
        ];
        
        ranges.forEach(item => {
            const rangeInput = document.getElementById(item.rangeId);
            const numInput = document.getElementById(item.numId);
            
            if (rangeInput && numInput) {
                rangeInput.addEventListener('input', () => {
                    numInput.value = rangeInput.value;
                    this.updateLivePreview();
                    this.saveToStorage();
                });
                
                numInput.addEventListener('input', () => {
                    let val = parseInt(numInput.value);
                    if (isNaN(val)) val = 0;
                    numInput.value = val;
                    if (rangeInput) {
                        rangeInput.value = Math.min(Math.max(val, parseInt(rangeInput.min) || 0), parseInt(rangeInput.max) || 100);
                    }
                    this.updateLivePreview();
                    this.saveToStorage();
                });
            }
        });
        
        const settingsInputs = ['cardBgColor', 'cardBorderColor', 'imageBorderColor', 'numberBgColor', 'numberTextColor', 'nameColor', 'classColor',
            'numberFontWeight', 'nameFontWeight', 'cardShadow', 'nameTextAlign', 'classTextAlign',
            'showSeatNumber', 'showStudentPhoto', 'showFullName', 'showClassName'];
        
        settingsInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    this.updateLivePreview();
                    this.saveToStorage();
                });
                if (el.type !== 'checkbox') {
                    el.addEventListener('input', () => {
                        this.updateLivePreview();
                        this.saveToStorage();
                    });
                }
            }
        });
        
        const imageRoundFull = document.getElementById('imageRoundFull');
        const imageBorderRadius = document.getElementById('imageBorderRadius');
        const imageBorderRadiusNum = document.getElementById('imageBorderRadiusNum');
        
        if (imageRoundFull && imageBorderRadius && imageBorderRadiusNum) {
            this.savedImageBorderRadius = parseInt(imageBorderRadius.value) || 0;
            
            imageRoundFull.addEventListener('change', (e) => {
                if (imageRoundFull.checked) {
                    this.savedImageBorderRadius = parseInt(imageBorderRadius.value) || 0;
                    imageBorderRadius.value = 999;
                    imageBorderRadiusNum.value = 999;
                } else {
                    imageBorderRadius.value = this.savedImageBorderRadius;
                    imageBorderRadiusNum.value = this.savedImageBorderRadius;
                }
                this.updateLivePreview();
                this.saveToStorage();
            });
        }
    }

    setupNumberingTypeListener() {
        const numberingType = document.getElementById('numberingType');
        if (numberingType) {
            numberingType.addEventListener('change', () => {
                const isRoundRobin = numberingType.value === 'roundRobin';
                const roundRobinInfo = document.getElementById('roundRobinInfo');
                if (roundRobinInfo) {
                    roundRobinInfo.style.display = isRoundRobin ? 'flex' : 'none';
                }
                this.toggleNumberingOptions();
            });
        }
    }

    setupEventListeners() {
        
        // دکمه‌های موبایل
        const mobileHomeBtn = document.getElementById('mobileHomeBtn');
        const mobileHelpBtn = document.getElementById('mobileHelpBtn');
        const mobileResetBtn = document.getElementById('mobileResetBtn');
        
        if (mobileHomeBtn) mobileHomeBtn.addEventListener('click', () => window.location.href = '../index.html');
        if (mobileHelpBtn) mobileHelpBtn.addEventListener('click', () => this.activateTab('help'));
        if (mobileResetBtn) mobileResetBtn.addEventListener('click', () => this.resetSystem());
        
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
        const gotoNumbering = document.getElementById('gotoNumberingBtn');
        if (startDownload) startDownload.addEventListener('click', () => this.startDownload());
        if (stopDownload) stopDownload.addEventListener('click', () => this.stopDownload());
        if (gotoNumbering) gotoNumbering.addEventListener('click', () => this.activateTab('number-rules'));

        const applyNumbering = document.getElementById('applyNumberingBtn');
        if (applyNumbering) applyNumbering.addEventListener('click', () => this.applyNumbering());

        const saveDesign = document.getElementById('saveDesignBtn');
        if (saveDesign) saveDesign.addEventListener('click', () => {
            this.saveToStorage();
            this.showNotification('✅ طراحی ذخیره شد', 'success');
            this.activateTab('print');
            this.updatePrintStats();
        });
        
        const resetDesign = document.getElementById('resetDesignBtn');
        if (resetDesign) resetDesign.addEventListener('click', () => this.resetDesign());

        const printBtn = document.getElementById('printBtn');
        const downloadPdf = document.getElementById('downloadPDFBtn');
        const downloadExcel = document.getElementById('downloadExcelReportBtn');
        if (printBtn) printBtn.addEventListener('click', () => this.printCards());
        if (downloadPdf) downloadPdf.addEventListener('click', () => this.downloadPDF());
        if (downloadExcel) downloadExcel.addEventListener('click', () => this.downloadExcelReport());

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
    }
    
    resetDesign() {
        const defaultSettings = {
            cardBgColor: '#ffffff',
            cardBorderWidth: 1,
            cardBorderRadius: 14,
            cardBorderColor: '#cccccc',
            cardShadow: 'none',
            showStudentPhoto: true,
            imagePosition: 'right',
            imageWidth: 50,
            imageBorderRadius: 0,
            imageBorderWidth: 1,
            imageBorderColor: '#cccccc',
            imageOpacity: 100,
            showSeatNumber: true,
            numberFontSize: 180,
            numberFontWeight: 'bold',
            numberBgColor: '#ffffff',
            numberTextColor: '#000000',
            numberBorderRadius: 20,
            numberPadding: 15,
            showFullName: true,
            nameFontSize: 60,
            nameFontWeight: 'bold',
            nameColor: '#000000',
            nameTextAlign: 'center',
            showClassName: true,
            classFontSize: 60,
            classColor: '#000000',
            classTextAlign: 'center',
            cardPadding: 9,
            gapTextImage: 25,
            gapNumberName: 15,
            gapNameClass: 10
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
        
        const imageRoundFull = document.getElementById('imageRoundFull');
        if (imageRoundFull) imageRoundFull.checked = false;
        this.savedImageBorderRadius = 0;
        
        const posBtns = document.querySelectorAll('.pos-btn');
        posBtns.forEach(btn => {
            if (btn.getAttribute('data-pos') === 'right') btn.classList.add('active');
            else btn.classList.remove('active');
        });
        
        const imagePositionInput = document.getElementById('imagePosition');
        if (imagePositionInput) imagePositionInput.value = 'right';
        
        this.updateLivePreview();
        this.saveToStorage();
        this.showNotification('✅ طراحی به حالت پیش‌فرض بازنشانی شد', 'success');
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
        this.activateTab('school-info');
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
                    html += `<td>${this.toPersianNumbersInText(cell)}</td>`;
                }
            });
            html += '</tr>';
        }
        html += '</tbody>';
        
        if (table) table.innerHTML = html;
        if (previewDiv) previewDiv.style.display = 'block';
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

    downloadSampleFile() {
        const sample = [
            ['کد ملی', 'نام', 'نام خانوادگی', 'کلاس'],
            ['1234567890', 'امیرعلی', 'آزادی', 'دهم ریاضی'],
            ['2345678901', 'محمدحسین', 'کریمی', 'دهم تجربی']
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
        this.updateLivePreview();
        
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

    updatePrintStats() {
        if (!this.seatCards) return;
        const totalCardsSpan = document.getElementById('printTotalCards');
        const totalPagesSpan = document.getElementById('printTotalPages');
        if (totalCardsSpan) totalCardsSpan.innerHTML = this.toPersianNumber(this.seatCards.length);
        if (totalPagesSpan) totalPagesSpan.innerHTML = this.toPersianNumber(this.seatCards.length);
    }

    chunkArray(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
        return chunks;
    }

    toggleNumberingOptions() {
        const type = document.getElementById('numberingType').value;
        const multipleGroup = document.getElementById('multipleInputGroup');
        const customGroup = document.getElementById('customRangeGroup');
        
        if (multipleGroup) multipleGroup.style.display = type === 'multiple' ? 'block' : 'none';
        if (customGroup) customGroup.style.display = type === 'custom' ? 'block' : 'none';
        this.updateSampleNumbering();
    }

    updateSampleNumbering() {
        const sample = this.generateNumbers(5);
        const prefix = document.getElementById('numberPrefix').value;
        const suffix = document.getElementById('numberSuffix').value;
        const sampleSpan = document.getElementById('sampleNumbering');
        if (sampleSpan) {
            const sampleText = sample.map(n => `${prefix}${this.toPersianNumber(n)}${suffix}`).join(' ، ');
            sampleSpan.innerHTML = sampleText || '۱ ، ۲ ، ۳ ، ۴ ، ۵';
        }
    }

    generateNumbers(count) {
        const type = document.getElementById('numberingType').value;
        const startFrom = parseInt(document.getElementById('startFrom').value) || 1;
        const step = parseInt(document.getElementById('stepValue').value) || 1;
        const multiple = parseInt(document.getElementById('multipleValue').value) || 2;
        const customStart = parseInt(document.getElementById('customStart').value) || 1;
        const customEnd = parseInt(document.getElementById('customEnd').value) || 100;
        
        let nums = [];
        
        switch(type) {
            case 'sequential':
                for (let i = 0; i < count; i++) nums.push(startFrom + (i * step));
                break;
            case 'even':
                let evenStart = startFrom % 2 === 0 ? startFrom : startFrom + 1;
                for (let i = 0; i < count; i++) nums.push(evenStart + (i * step * 2));
                break;
            case 'odd':
                let oddStart = startFrom % 2 === 1 ? startFrom : startFrom + 1;
                for (let i = 0; i < count; i++) nums.push(oddStart + (i * step * 2));
                break;
            case 'multiple':
                let multipleStart = Math.ceil(startFrom / multiple) * multiple;
                for (let i = 0; i < count; i++) nums.push(multipleStart + (i * multiple * step));
                break;
            case 'custom':
                for (let i = customStart; i <= customEnd && nums.length < count; i += step) nums.push(i);
                break;
            case 'reverse':
                for (let i = 0; i < count; i++) nums.push(startFrom + ((count - 1 - i) * step));
                break;
            case 'random':
                for (let i = 1; i <= count; i++) nums.push(i);
                for (let i = nums.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [nums[i], nums[j]] = [nums[j], nums[i]];
                }
                break;
            default:
                for (let i = 0; i < count; i++) nums.push(startFrom + (i * step));
        }
        return nums;
    }

    roundRobinArrange(students) {
        const groups = {};
        students.forEach(student => {
            const className = student.className || 'بدون کلاس';
            if (!groups[className]) groups[className] = [];
            groups[className].push(student);
        });
        
        const classNames = Object.keys(groups);
        const arranged = [];
        let maxLen = Math.max(...Object.values(groups).map(g => g.length));
        
        for (let i = 0; i < maxLen; i++) {
            for (let j = 0; j < classNames.length; j++) {
                if (groups[classNames[j]][i]) arranged.push(groups[classNames[j]][i]);
            }
        }
        return arranged;
    }

    applyNumbering() {
        if (!this.students || !this.students.length) {
            this.showNotification('❌ ابتدا فایل Excel را آپلود کنید', 'warning');
            this.activateTab('excel-upload');
            return;
        }
        
        const classFilter = document.getElementById('classFilter').value;
        let filtered = this.students;
        if (classFilter !== 'all') filtered = this.students.filter(s => s.className === classFilter);
        
        if (!filtered.length) {
            this.showNotification('❌ دانش‌آموزی در این کلاس یافت نشد', 'warning');
            return;
        }
        
        const sortOrder = document.getElementById('sortOrder').value;
        const numberingType = document.getElementById('numberingType').value;
        
        let sorted = [...filtered];
        
        if (sortOrder === 'lastName') {
            sorted.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || '', 'fa'));
        } else if (sortOrder === 'firstName') {
            sorted.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || '', 'fa'));
        }
        
        let finalOrder = sorted;
        if (numberingType === 'roundRobin') finalOrder = this.roundRobinArrange(sorted);
        
        const numbers = this.generateNumbers(finalOrder.length);
        const prefix = document.getElementById('numberPrefix').value;
        const suffix = document.getElementById('numberSuffix').value;
        
        this.seatCards = finalOrder.map((student, idx) => ({
            student: student,
            rawNumber: numbers[idx],
            displayNumber: `${prefix}${this.toPersianNumber(numbers[idx])}${suffix}`
        }));
        
        if (sortOrder === 'byNumber') this.seatCards.sort((a, b) => a.rawNumber - b.rawNumber);
        
        this.showNotification(`✅ ${this.seatCards.length} کارت ساخته شد`, 'success');
        this.updatePrintStats();
        this.updateLivePreview();
        this.activateTab('card-design');
    }

    getSettings() {
        return {
            showSeatNumber: document.getElementById('showSeatNumber')?.checked ?? true,
            showStudentPhoto: document.getElementById('showStudentPhoto')?.checked ?? true,
            showFullName: document.getElementById('showFullName')?.checked ?? true,
            showClassName: document.getElementById('showClassName')?.checked ?? true,
            imagePosition: document.getElementById('imagePosition')?.value || 'right',
            imageWidth: parseInt(document.getElementById('imageWidth')?.value) || 50,
            imageBorderRadius: parseInt(document.getElementById('imageBorderRadius')?.value) || 0,
            imageBorderWidth: parseInt(document.getElementById('imageBorderWidth')?.value) || 1,
            imageBorderColor: document.getElementById('imageBorderColor')?.value || '#cccccc',
            imageOpacity: parseInt(document.getElementById('imageOpacity')?.value) || 100,
            numberFontSize: parseInt(document.getElementById('numberFontSize')?.value) || 180,
            numberFontWeight: document.getElementById('numberFontWeight')?.value || 'bold',
            numberBgColor: document.getElementById('numberBgColor')?.value || '#ffffff',
            numberTextColor: document.getElementById('numberTextColor')?.value || '#000000',
            numberBorderRadius: parseInt(document.getElementById('numberBorderRadius')?.value) || 20,
            numberPadding: parseInt(document.getElementById('numberPadding')?.value) || 15,
            nameFontSize: parseInt(document.getElementById('nameFontSize')?.value) || 60,
            nameFontWeight: document.getElementById('nameFontWeight')?.value || 'bold',
            nameColor: document.getElementById('nameColor')?.value || '#000000',
            nameTextAlign: document.getElementById('nameTextAlign')?.value || 'center',
            classFontSize: parseInt(document.getElementById('classFontSize')?.value) || 60,
            classColor: document.getElementById('classColor')?.value || '#000000',
            classTextAlign: document.getElementById('classTextAlign')?.value || 'center',
            cardBgColor: document.getElementById('cardBgColor')?.value || '#ffffff',
            cardBorderWidth: parseInt(document.getElementById('cardBorderWidth')?.value) || 1,
            cardBorderColor: document.getElementById('cardBorderColor')?.value || '#cccccc',
            cardBorderRadius: parseInt(document.getElementById('cardBorderRadius')?.value) || 14,
            cardShadow: document.getElementById('cardShadow')?.value || 'none',
            cardPadding: parseInt(document.getElementById('cardPadding')?.value) || 9,
            gapTextImage: parseInt(document.getElementById('gapTextImage')?.value) || 25,
            gapNumberName: parseInt(document.getElementById('gapNumberName')?.value) || 15,
            gapNameClass: parseInt(document.getElementById('gapNameClass')?.value) || 10
        };
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

    updateLivePreview() {
        const previewContainer = document.getElementById('livePreviewCard');
        if (!previewContainer) return;
        
        if (!this.seatCards || !this.seatCards.length) {
            previewContainer.innerHTML = '<div class="empty-preview"><i class="fas fa-chair"></i><p>لطفاً ابتدا شماره‌گذاری را اعمال کنید</p></div>';
            return;
        }
        
        const sampleCard = this.seatCards[0];
        const settings = this.getSettings();
        const cardHtml = this.renderA4Card(sampleCard, settings);
        previewContainer.innerHTML = `<div class="a4-aspect"><div>${cardHtml}</div></div>`;
        this.adjustPreviewSize();
    }

    renderA4Card(card, settings) {
        const fullName = `${card.student.firstName} ${card.student.lastName}`.trim();
        const seatNumber = card.displayNumber || this.toPersianNumber(card.rawNumber);
        const className = card.student.className;
        const photoUrl = this.getPhotoUrl(card.student);

        const shadowValue = {
            'none': 'none',
            'sm': '0 2px 8px rgba(0,0,0,0.1)',
            'md': '0 8px 20px rgba(0,0,0,0.15)',
            'lg': '0 12px 30px rgba(0,0,0,0.2)'
        }[settings.cardShadow] || 'none';

        const cardStyle = `background: ${settings.cardBgColor}; border: ${settings.cardBorderWidth}px solid ${settings.cardBorderColor}; border-radius: ${settings.cardBorderRadius}px; box-shadow: ${shadowValue}; display: flex; width: 100%; height: 100%; overflow: hidden; box-sizing: border-box; padding: ${settings.cardPadding}mm;`;
        
        const imageWidthPercent = Math.min(80, Math.max(20, settings.imageWidth));
        const imageStyle = `width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: ${settings.imageBorderRadius}px; border: ${settings.imageBorderWidth}px solid ${settings.imageBorderColor}; opacity: ${settings.imageOpacity / 100};`;
        
        let imageHtml = '';
        if (settings.showStudentPhoto) {
            if (photoUrl) {
                imageHtml = `<div class="a4-card-image" style="width: ${imageWidthPercent}%;"><img src="${photoUrl}" style="${imageStyle}" onclick="seatSystem.viewImage('${photoUrl}')"></div>`;
            } else {
                imageHtml = `<div class="a4-card-image" style="width: ${imageWidthPercent}%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; border-radius: ${settings.imageBorderRadius}px;"><span style="font-size: 40px; color: #999;">📷</span></div>`;
            }
        }
        
        const contentStyle = `flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 ${settings.gapTextImage}px;`;
        const numberStyle = `font-size: ${settings.numberFontSize}px; font-weight: ${settings.numberFontWeight}; background: ${settings.numberBgColor}; color: ${settings.numberTextColor}; border-radius: ${settings.numberBorderRadius}px; padding: ${settings.numberPadding}px 20px; display: inline-block; text-align: center; line-height: 1.2;`;
        const nameStyle = `font-size: ${settings.nameFontSize}px; font-weight: ${settings.nameFontWeight}; color: ${settings.nameColor}; margin: 0; text-align: ${settings.nameTextAlign}; word-break: break-word; line-height: 1.3;`;
        const classStyle = `font-size: ${settings.classFontSize}px; color: ${settings.classColor}; margin: 0; text-align: ${settings.classTextAlign}; line-height: 1.3;`;
        
        let contentHtml = `
            <div class="a4-card-content" style="${contentStyle}">
                ${settings.showSeatNumber ? `<div style="text-align: center; margin-bottom: ${settings.gapNumberName}px;"><div class="card-number-text" style="${numberStyle}">${seatNumber}</div></div>` : ''}
                ${settings.showFullName && fullName ? `<div style="text-align: center; margin-bottom: ${settings.gapNameClass}px;"><div class="card-name" style="${nameStyle}">${fullName}</div></div>` : ''}
                ${settings.showClassName && className ? `<div style="text-align: center;"><div class="card-class" style="${classStyle}">${className}</div></div>` : ''}
            </div>
        `;
        
        if (settings.imagePosition === 'left') {
            return `<div class="a4-card" style="${cardStyle}">${imageHtml}${contentHtml}</div>`;
        } else {
            return `<div class="a4-card" style="${cardStyle}">${contentHtml}${imageHtml}</div>`;
        }
    }

    renderFullCard(card, settings) {
        const fullName = `${card.student.firstName} ${card.student.lastName}`.trim();
        const seatNumber = card.displayNumber || this.toPersianNumber(card.rawNumber);
        const className = card.student.className;
        const photoUrl = this.getPhotoUrl(card.student);

        const cardStyle = `background: ${settings.cardBgColor}; border: ${settings.cardBorderWidth}px solid ${settings.cardBorderColor}; border-radius: ${settings.cardBorderRadius}px; display: flex; width: 100%; height: 100%; overflow: hidden; box-sizing: border-box; padding: ${settings.cardPadding}mm;`;
        
        const imageWidthPercent = Math.min(80, Math.max(20, settings.imageWidth));
        const imageStyle = `width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: ${settings.imageBorderRadius}px; border: ${settings.imageBorderWidth}px solid ${settings.imageBorderColor}; opacity: ${settings.imageOpacity / 100};`;
        
        let imageHtml = '';
        if (settings.showStudentPhoto) {
            if (photoUrl) {
                imageHtml = `<div class="a4-card-image" style="width: ${imageWidthPercent}%;"><img src="${photoUrl}" style="${imageStyle}"></div>`;
            } else {
                imageHtml = `<div class="a4-card-image" style="width: ${imageWidthPercent}%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; border-radius: ${settings.imageBorderRadius}px;"><span style="font-size: 48px; color: #999;">📷</span></div>`;
            }
        }
        
        const numberStyle = `font-size: ${settings.numberFontSize}px; font-weight: ${settings.numberFontWeight}; background: ${settings.numberBgColor}; color: ${settings.numberTextColor}; border-radius: ${settings.numberBorderRadius}px; padding: ${settings.numberPadding}px 24px; display: inline-block; text-align: center;`;
        const nameStyle = `font-size: ${settings.nameFontSize}px; font-weight: ${settings.nameFontWeight}; color: ${settings.nameColor}; margin: 0; text-align: ${settings.nameTextAlign}; word-break: break-word;`;
        const classStyle = `font-size: ${settings.classFontSize}px; color: ${settings.classColor}; margin: 0; text-align: ${settings.classTextAlign};`;
        
        let contentHtml = `
            <div class="a4-card-content" style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 ${settings.gapTextImage}px;">
                ${settings.showSeatNumber ? `<div style="text-align: center; margin-bottom: ${settings.gapNumberName}px;"><div style="${numberStyle}">${seatNumber}</div></div>` : ''}
                ${settings.showFullName && fullName ? `<div style="text-align: center; margin-bottom: ${settings.gapNameClass}px;"><div style="${nameStyle}">${fullName}</div></div>` : ''}
                ${settings.showClassName && className ? `<div style="text-align: center;"><div style="${classStyle}">${className}</div></div>` : ''}
            </div>
        `;
        
        if (settings.imagePosition === 'left') {
            return `<div class="a4-card" style="${cardStyle}">${imageHtml}${contentHtml}</div>`;
        } else {
            return `<div class="a4-card" style="${cardStyle}">${contentHtml}${imageHtml}</div>`;
        }
    }

    generatePrintHTML() {
        const settings = this.getSettings();
        const margin = parseInt(document.getElementById('printMargin').value) || 5;
        
        let pagesHtml = '';
        for (let i = 0; i < this.seatCards.length; i++) {
            const cardHtml = this.renderFullCard(this.seatCards[i], settings);
            pagesHtml += `<div class="print-page" style="width: 100%; height: 100%; padding: ${margin}mm; box-sizing: border-box; page-break-after: always; display: flex; align-items: center; justify-content: center;">${cardHtml}</div>`;
        }
        
        return `<!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>کارت‌های شماره صندلی - ${this.seatCards.length} کارت</title>
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
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazir', sans-serif; }
                body { background: white; direction: rtl; }
                @page { size: A4 landscape; margin: 0; }
                @media print { 
                    body { margin: 0; padding: 0; } 
                    .print-page { page-break-after: always; }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
                .print-page { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
                
                .a4-card {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background: ${settings.cardBgColor};
                    border: ${settings.cardBorderWidth}px solid ${settings.cardBorderColor};
                    border-radius: ${settings.cardBorderRadius}px;
                    overflow: hidden;
                    padding: ${settings.cardPadding}mm;
                    box-sizing: border-box;
                }
                .a4-card-image {
                    flex-shrink: 0;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .a4-card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    border-radius: ${settings.imageBorderRadius}px;
                    border: ${settings.imageBorderWidth}px solid ${settings.imageBorderColor};
                    opacity: ${settings.imageOpacity / 100};
                }
                .a4-card-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 ${settings.gapTextImage}px;
                }
                .card-number-text {
                    font-size: ${settings.numberFontSize}px;
                    font-weight: ${settings.numberFontWeight};
                    background: ${settings.numberBgColor};
                    color: ${settings.numberTextColor};
                    border-radius: ${settings.numberBorderRadius}px;
                    padding: ${settings.numberPadding}px 24px;
                    display: inline-block;
                    text-align: center;
                }
                .card-name {
                    font-size: ${settings.nameFontSize}px;
                    font-weight: ${settings.nameFontWeight};
                    color: ${settings.nameColor};
                    text-align: ${settings.nameTextAlign};
                }
                .card-class {
                    font-size: ${settings.classFontSize}px;
                    color: ${settings.classColor};
                    text-align: ${settings.classTextAlign};
                }
            </style>
        </head>
        <body>${pagesHtml}</body>
        </html>`;
    }

    printCards() {
        if (!this.seatCards || !this.seatCards.length) {
            this.showNotification('❌ ابتدا شماره‌گذاری را انجام دهید', 'warning');
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

    async downloadPDF() {
        if (!this.seatCards || !this.seatCards.length) {
            this.showNotification('❌ ابتدا شماره‌گذاری را انجام دهید', 'warning');
            return;
        }
        
        this.showNotification('⏳ در حال ایجاد PDF...', 'info');
        
        const printHtml = this.generatePrintHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = printHtml;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        try {
            await html2pdf().set({
                margin: [0, 0, 0, 0],
                filename: `seat-cards-${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            }).from(tempDiv).save();
            this.showNotification('✅ PDF ایجاد شد', 'success');
        } catch(e) {
            console.error('PDF error:', e);
            this.showNotification('❌ خطا در ایجاد PDF', 'error');
        }
        
        document.body.removeChild(tempDiv);
    }

    downloadExcelReport() {
        if (!this.seatCards || !this.seatCards.length) {
            this.showNotification('❌ ابتدا شماره‌گذاری را انجام دهید', 'warning');
            return;
        }
        
        const data = [['ردیف', 'شماره صندلی', 'نام', 'نام خانوادگی', 'کلاس', 'کد ملی']];
        this.seatCards.forEach((card, idx) => {
            data.push([idx + 1, card.displayNumber, card.student.firstName, card.student.lastName, card.student.className, card.student.nationalCode]);
        });
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'کارت‌ها');
        XLSX.writeFile(wb, `seat-cards-${Date.now()}.xlsx`);
        this.showNotification('✅ گزارش Excel دانلود شد', 'success');
    }

    resetSystem() {
        if (confirm('آیا از شروع مجدد اطمینان دارید؟ تمام اطلاعات پاک خواهد شد.')) {
            this.excelData = null;
            this.excelHeaders = [];
            this.columnMappings = { nationalCode: null, firstName: null, lastName: null, className: null };
            this.students = [];
            this.seatCards = [];
            this.studentImages = {};
            
            const fileNameSpan = document.getElementById('excelFileName');
            const columnSelector = document.getElementById('columnSelector');
            const excelPreview = document.getElementById('excelPreview');
            const livePreview = document.getElementById('livePreviewCard');
            
            if (fileNameSpan) fileNameSpan.innerHTML = '';
            if (columnSelector) columnSelector.style.display = 'none';
            if (excelPreview) excelPreview.style.display = 'none';
            if (livePreview) livePreview.innerHTML = '<div class="empty-preview"><i class="fas fa-chair"></i><p>لطفاً ابتدا شماره‌گذاری را اعمال کنید</p></div>';
            
            this.activateTab('excel-upload');
            this.showNotification('✅ سیستم ریست شد', 'success');
        }
    }

    saveToStorage() {
        const settings = {
            numberingType: document.getElementById('numberingType')?.value || 'sequential',
            multipleValue: document.getElementById('multipleValue')?.value || '2',
            customStart: document.getElementById('customStart')?.value || '1',
            customEnd: document.getElementById('customEnd')?.value || '100',
            startFrom: document.getElementById('startFrom')?.value || '1',
            stepValue: document.getElementById('stepValue')?.value || '1',
            numberPrefix: document.getElementById('numberPrefix')?.value || '',
            numberSuffix: document.getElementById('numberSuffix')?.value || '',
            sortOrder: document.getElementById('sortOrder')?.value || 'original',
            printMargin: document.getElementById('printMargin')?.value || '5',
            
            showSeatNumber: document.getElementById('showSeatNumber')?.checked ?? true,
            showStudentPhoto: document.getElementById('showStudentPhoto')?.checked ?? true,
            showFullName: document.getElementById('showFullName')?.checked ?? true,
            showClassName: document.getElementById('showClassName')?.checked ?? true,
            imagePosition: document.getElementById('imagePosition')?.value || 'right',
            imageWidth: document.getElementById('imageWidth')?.value || '50',
            imageBorderRadius: document.getElementById('imageBorderRadius')?.value || '0',
            imageBorderWidth: document.getElementById('imageBorderWidth')?.value || '1',
            imageBorderColor: document.getElementById('imageBorderColor')?.value || '#cccccc',
            imageOpacity: document.getElementById('imageOpacity')?.value || '100',
            numberFontSize: document.getElementById('numberFontSize')?.value || '180',
            numberFontWeight: document.getElementById('numberFontWeight')?.value || 'bold',
            numberBgColor: document.getElementById('numberBgColor')?.value || '#ffffff',
            numberTextColor: document.getElementById('numberTextColor')?.value || '#000000',
            numberBorderRadius: document.getElementById('numberBorderRadius')?.value || '20',
            numberPadding: document.getElementById('numberPadding')?.value || '15',
            nameFontSize: document.getElementById('nameFontSize')?.value || '60',
            nameFontWeight: document.getElementById('nameFontWeight')?.value || 'bold',
            nameColor: document.getElementById('nameColor')?.value || '#000000',
            nameTextAlign: document.getElementById('nameTextAlign')?.value || 'center',
            classFontSize: document.getElementById('classFontSize')?.value || '60',
            classColor: document.getElementById('classColor')?.value || '#000000',
            classTextAlign: document.getElementById('classTextAlign')?.value || 'center',
            cardBgColor: document.getElementById('cardBgColor')?.value || '#ffffff',
            cardBorderWidth: document.getElementById('cardBorderWidth')?.value || '1',
            cardBorderColor: document.getElementById('cardBorderColor')?.value || '#cccccc',
            cardBorderRadius: document.getElementById('cardBorderRadius')?.value || '14',
            cardShadow: document.getElementById('cardShadow')?.value || 'none',
            cardPadding: document.getElementById('cardPadding')?.value || '9',
            gapTextImage: document.getElementById('gapTextImage')?.value || '25',
            gapNumberName: document.getElementById('gapNumberName')?.value || '15',
            gapNameClass: document.getElementById('gapNameClass')?.value || '10'
        };
        localStorage.setItem('seatNumberSystem', JSON.stringify(settings));
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('seatNumberSystem');
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
                
                const savedBorderRadius = data.imageBorderRadius;
                if (savedBorderRadius && savedBorderRadius !== 999) {
                    this.savedImageBorderRadius = parseInt(savedBorderRadius);
                }
                
                const imagePosition = data.imagePosition || 'right';
                const posBtns = document.querySelectorAll('.pos-btn');
                posBtns.forEach(btn => {
                    if (btn.getAttribute('data-pos') === imagePosition) btn.classList.add('active');
                    else btn.classList.remove('active');
                });
                
                const imagePositionInput = document.getElementById('imagePosition');
                if (imagePositionInput) imagePositionInput.value = imagePosition;
            } else {
                this.resetDesign();
            }
        } catch(e) {
            console.error("Error loading settings:", e);
        }
        
        this.toggleNumberingOptions();
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

let seatSystem;
document.addEventListener('DOMContentLoaded', () => {
    seatSystem = new SeatNumberSystem();
    window.seatSystem = seatSystem;
});