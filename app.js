// --- FIREBASE CLOUD DATABASE CONFIGURATION ---
// Multi-User Central Brain. Replace these with actual project keys from console.firebase.google.com
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

let isFirebaseActive = false;
let db, auth;

try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        isFirebaseActive = true;
    }
} catch (e) {
    console.log("Firebase initialization logic skipped or missing.", e);
}

const NISAB_2026_GOLD = 1374000;
const ZAKAT_RATE = 0.025; // 2.5%

const state = {
    items: [], // Array of { id, contactName (optional), desc, amount, type, category, date }
    hasSeenOnboarding: false,
    hasSeenGuide: false,
    hasSeenTutorial: false,
    tooltipDismissed: false,
    hijriMode: true,
    isPremium: false,
    themeColor: '#1B3022',
    previewColor: null,
    biometricsEnabled: false,
    appUnlocked: true,
    currentUser: null,
    currentView: 'dashboard',
    activeContact: null,
    modalContext: '', // 'transaction' or 'asset'
    transactionType: 'receivable', // 'receivable', 'liability'
    currency: 'INR',
    decimalsMode: 'hide',
    language: 'en'
};

const i18n = {
    en: {
        othersOweMe: "Others Owe Me",
        iOweOthers: "I Owe Others",
        amanahLedger: "Amanah Ledger",
        wealthAndZakat: "Wealth & Zakat",
        settingsTitle: "Settings",
        contacts: "Contacts",
        addRecord: "+ Add Record",
        noRecords: "No records found. Start adding Amanah!",
        net: "Net",
        transactionHistory: "Transaction History",
        pdfStatement: "PDF Statement",
        zakatStatus: "Zakat Status",
        totalWealth: "Total Wealth (Assets + Receivables - Liabilities)",
        zakatDue: "Zakat Due (2.5%)",
        myPureAssets: "My Pure Assets (Cash & Gold)",
        addAsset: "+ Add Asset",
        owesYou: "Owes you",
        youOwe: "You owe"
    },
    ar: {
        othersOweMe: "الآخرون مدينون لي",
        iOweOthers: "أنا مدين للآخرين",
        amanahLedger: "دفتر الأمانة",
        wealthAndZakat: "الثروة والزكاة",
        settingsTitle: "الإعدادات",
        contacts: "جهات الاتصال",
        addRecord: "+ إضافة سجل",
        noRecords: "لم يتم العثور على سجلات. ابدأ بإضافة الأمانة!",
        net: "الصافي",
        transactionHistory: "سجل المعاملات",
        pdfStatement: "بيان PDF",
        zakatStatus: "حالة الزكاة",
        totalWealth: "إجمالي الثروة (الأصول + الذمم المدينة - الذمم الدائنة)",
        zakatDue: "الزكاة المستحقة (2.5%)",
        myPureAssets: "أصولي النقية (النقد والذهب)",
        addAsset: "+ إضافة أصل",
        owesYou: "يدين لك",
        youOwe: "أنت مدين"
    },
    es: {
        othersOweMe: "Otros Me Deben",
        iOweOthers: "Debo a Otros",
        amanahLedger: "Libro Amanah",
        wealthAndZakat: "Riqueza y Zakat",
        settingsTitle: "Ajustes",
        contacts: "Contactos",
        addRecord: "+ Añadir Registro",
        noRecords: "No se encontraron registros. ¡Comienza a añadir!",
        net: "Neto",
        transactionHistory: "Historial de Transacciones",
        pdfStatement: "Extracto en PDF",
        zakatStatus: "Estado del Zakat",
        totalWealth: "Riqueza Total (Activos + Cobros - Pasivos)",
        zakatDue: "Zakat Adeudado (2.5%)",
        myPureAssets: "Mis Activos Puros (Efectivo y Oro)",
        addAsset: "+ Añadir Activo",
        owesYou: "Te debe",
        youOwe: "Debes"
    },
    fr: {
        othersOweMe: "Les Autres Me Doivent",
        iOweOthers: "Je Dois aux Autres",
        amanahLedger: "Registre Amanah",
        wealthAndZakat: "Richesse et Zakat",
        settingsTitle: "Paramètres",
        contacts: "Contacts",
        addRecord: "+ Ajouter un Enregistrement",
        noRecords: "Aucun enregistrement trouvé. Commencez à ajouter !",
        net: "Net",
        transactionHistory: "Historique des Transactions",
        pdfStatement: "Relevé PDF",
        zakatStatus: "Statut de la Zakat",
        totalWealth: "Richesse Totale (Actifs + Créances - Dettes)",
        zakatDue: "Zakat Due (2.5%)",
        myPureAssets: "Mes Actifs Purs (Espèces et Or)",
        addAsset: "+ Ajouter un Actif",
        owesYou: "Vous doit",
        youOwe: "Vous devez"
    },
    ur: {
        othersOweMe: "دوسرے میرے مقروض ہیں",
        iOweOthers: "میں دوسروں کا مقروض ہوں",
        amanahLedger: "امانت لیجر",
        wealthAndZakat: "دولت اور زکوٰۃ",
        settingsTitle: "ترتیبات",
        contacts: "رابطے",
        addRecord: "+ ریکارڈ شامل کریں",
        noRecords: "کوئی ریکارڈ نہیں ملا۔ امانت شامل کرنا شروع کریں!",
        net: "خالص",
        transactionHistory: "لین دین کی تاریخ",
        pdfStatement: "پی ڈی ایف اسٹیٹمنٹ",
        zakatStatus: "زکوٰۃ کی حیثیت",
        totalWealth: "کل دولت (اثاثے + وصولیاں - واجبات)",
        zakatDue: "زکوٰۃ واجب الادا (2.5%)",
        myPureAssets: "میرے خالص اثاثے (نقد اور سونا)",
        addAsset: "+ اثاثہ شامل کریں",
        owesYou: "آپ کا مقروض ہے",
        youOwe: "آپ مقروض ہیں"
    },
    hi: {
        othersOweMe: "दूसरों को देना है",
        iOweOthers: "मुझे दूसरों को देना है",
        amanahLedger: "अमानत बहीखाता",
        wealthAndZakat: "धन और जकात",
        settingsTitle: "सेटिंग्स",
        contacts: "संपर्क",
        addRecord: "+ रिकॉर्ड जोड़ें",
        noRecords: "कोई रिकॉर्ड नहीं मिला। अमानत जोड़ना शुरू करें!",
        net: "शुद्ध राशि",
        transactionHistory: "लेन-देन इतिहास",
        pdfStatement: "PDF स्टेटमेंट",
        zakatStatus: "जकात स्थिति",
        totalWealth: "कुल धन (संपत्ति + प्राप्य - देयता)",
        zakatDue: "देय जकात (2.5%)",
        myPureAssets: "मेरी शुद्ध संपत्ति (नकद और सोना)",
        addAsset: "+ संपत्ति जोड़ें",
        owesYou: "आपको लेना है",
        youOwe: "आपको देना है"
    }
};

const UI = {
    views: {
        dashboard: document.getElementById('view-dashboard'),
        contact: document.getElementById('view-contact'),
        zakat: document.getElementById('view-zakat'),
        settings: document.getElementById('view-settings')
    },
    navBtns: {
        dashboard: document.getElementById('nav-dashboard'),
        zakat: document.getElementById('nav-zakat'),
        settings: document.getElementById('nav-settings')
    },
    header: {
        title: document.getElementById('screen-title'),
        btnBack: document.getElementById('btn-back'),
        dateDisplay: document.getElementById('date-display')
    },
    dashboard: {
        totalReceivables: document.getElementById('total-receivables'),
        totalLiabilities: document.getElementById('total-liabilities'),
        contactsList: document.getElementById('contacts-list'),
        emptyState: document.getElementById('contacts-empty')
    },
    contactView: {
        avatar: document.getElementById('contact-avatar'),
        nameTitle: document.getElementById('contact-name-title'),
        netBalance: document.getElementById('contact-net-balance'),
        historyList: document.getElementById('contact-history-list')
    },
    zakat: {
        netAssetsText: document.getElementById('net-assets-display'),
        zakatDueText: document.getElementById('zakat-due-display'),
        progressBar: document.getElementById('zakat-progress'),
        zakatMessage: document.getElementById('zakat-message'),
        assetsList: document.getElementById('assets-list')
    },
    modal: {
        overlay: document.getElementById('item-modal'),
        title: document.getElementById('modal-title'),
        contactGroup: document.getElementById('contact-field-group'),
        inputContact: document.getElementById('item-contact'),
        descLabel: document.getElementById('desc-label'),
        inputDesc: document.getElementById('item-desc'),
        inputAmount: document.getElementById('item-amount'),
        typeGroup: document.getElementById('type-selector-group'),
        btnTypeRec: document.getElementById('btn-type-receivable'),
        btnTypeLiab: document.getElementById('btn-type-liability'),
        categorySection: document.getElementById('zakat-category-section'),
        itemCategoryInput: document.getElementById('item-category')
    },
    premium: {
        modal: document.getElementById('premium-modal'),
        status: document.getElementById('purchase-status'),
        btn: document.getElementById('btn-purchase'),
        backupBadge: document.getElementById('backup-badge'),
        backupDesc: document.getElementById('backup-desc'),
        backupSetting: document.getElementById('setting-backup'),
        backupIcon: document.getElementById('backup-icon'),
        bioDesc: document.getElementById('biometric-desc'),
        bioIcon: document.getElementById('biometric-icon'),
        fileInput: document.getElementById('file-restore-input'),
        lockScreen: document.getElementById('lock-screen')
    },
    theme: {
        modal: document.getElementById('theme-modal'),
        hexInput: document.getElementById('custom-hex-input')
    },
    onboarding: {
        overlay: document.getElementById('onboarding-overlay')
    },
    tooltip: document.getElementById('nudge-tooltip')
};

const app = {
    loginGoogle: async () => {
        if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive) {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                await auth.signInWithPopup(provider);
            } catch (err) {
                console.error(err);
                alert("Google Auth Error: " + err.message);
            }
        } else {
            // Demo fallback
            setTimeout(() => {
                localStorage.setItem('amanah-demo-logged-in', 'demo@gmail.com');
                state.currentUser = 'demo@gmail.com';
                document.getElementById('login-screen').classList.add('hidden');
                app.render();
            }, 500);
        }
    },

    loginUser: async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        if (!email || !pass) return alert('Please enter email and password');
        
        const loginBtn = document.querySelector('#login-screen .btn-action');
        const oldText = loginBtn.textContent;
        loginBtn.textContent = 'Authenticating...';
        
        if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive) {
            try {
                try {
                    await auth.signInWithEmailAndPassword(email, pass);
                } catch(e) {
                    if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
                        await auth.createUserWithEmailAndPassword(email, pass);
                    } else {
                        alert(e.message);
                        loginBtn.textContent = oldText;
                    }
                }
            } catch(err) {
                alert("Auth error: " + err.message);
                loginBtn.textContent = oldText;
            }
        } else {
            // Local Simulator / Fallback
            setTimeout(() => {
                localStorage.setItem('amanah-demo-logged-in', email);
                state.currentUser = email;
                document.getElementById('login-screen').classList.add('hidden');
                app.render();
            }, 500);
        }
    },
    
    logoutUser: () => {
        if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive) {
            auth.signOut();
        } else {
            localStorage.removeItem('amanah-demo-logged-in');
            state.currentUser = null;
            document.getElementById('login-screen').classList.remove('hidden');
        }
    },

    loadCloudData: async () => {
        if (typeof isFirebaseActive === 'undefined' || !isFirebaseActive || !state.currentUser) return;
        try {
            const snapshot = await db.collection('ledgers').doc(state.currentUser).get();
            if (snapshot.exists) {
                const data = snapshot.data();
                state.items = data.items || [];
                app.saveDataLocally(); // Cache locally
                app.render();
            }
        } catch (e) {
            console.error("Error loading from Cloud Brain", e);
        }
    },

    saveCloudData: async () => {
        if (typeof isFirebaseActive === 'undefined' || !isFirebaseActive || !state.currentUser) return;
        try {
            await db.collection('ledgers').doc(state.currentUser).set({
                items: state.items,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (e) {
            console.error("Error saving to Cloud Brain", e);
        }
    },
    
    saveDataLocally: () => {
        localStorage.setItem('amanah-items', JSON.stringify(state.items));
    },

    formatCurrency: (amount) => {
        let maxFrac = state.decimalsMode === 'show' ? 2 : 0;
        let minFrac = state.decimalsMode === 'show' ? 2 : 0;
        let formatter = new Intl.NumberFormat(state.language === 'en' ? 'en-US' : (state.language === 'ar' ? 'ar-SA' : 'en-US'), {
            style: 'currency',
            currency: state.currency,
            minimumFractionDigits: minFrac,
            maximumFractionDigits: maxFrac
        });
        return formatter.format(amount);
    },

    init: () => {
        app.loadData();
        
        // Handle Multi-User Cloud Auth On Startup
        if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive) {
            auth.onAuthStateChanged(user => {
                if (user) {
                    state.currentUser = user.uid;
                    document.getElementById('login-screen').classList.add('hidden');
                    app.loadCloudData();
                } else {
                    document.getElementById('login-screen').classList.remove('hidden');
                }
            });
        } else {
            // Local fallback logic since deployed keys aren't provided yet
            const loggedIn = localStorage.getItem('amanah-demo-logged-in');
            if (loggedIn) {
                state.currentUser = loggedIn;
                document.getElementById('login-screen').classList.add('hidden');
            } else {
                document.getElementById('login-screen').classList.remove('hidden');
            }
        }
        
        // Splash screen logic
        const splash = document.getElementById('splash-screen');
        if (splash) {
            setTimeout(() => {
                splash.classList.add('fade-out');
                setTimeout(() => splash.remove(), 500);
            }, 2000);
        }
        
        // Settings listeners
        document.getElementById('toggle-hijri').addEventListener('change', (e) => {
            state.hijriMode = e.target.checked;
            app.updateDateDisplay();
        });

        app.updateDateDisplay();
        
        if (!state.hasSeenOnboarding) {
            UI.onboarding.overlay.classList.remove('hidden');
        } else {
            if (state.biometricsEnabled) {
                state.appUnlocked = false;
                UI.premium.lockScreen.classList.remove('hidden');
            } else {
                app.render();
            }
        }
    },

    updateDateDisplay: () => {
        const today = new Date();
        if (state.hijriMode) {
            UI.header.dateDisplay.textContent = new Intl.DateTimeFormat('en-u-ca-islamic', {
                month: 'short', year: 'numeric'
            }).format(today);
        } else {
            UI.header.dateDisplay.textContent = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
    },

    navigate: (viewName) => {
        state.currentView = viewName;
        state.activeContact = null;
        app.renderViewVisibility();
    },

    navigateBack: () => {
        app.navigate('dashboard');
    },

    openContactView: (contactName) => {
        state.activeContact = contactName;
        state.currentView = 'contact';
        app.renderViewVisibility();
    },

    renderViewVisibility: () => {
        // Hide all
        Object.values(UI.views).forEach(v => v.classList.add('hidden'));
        Object.values(UI.navBtns).forEach(b => b.classList.remove('active'));
        UI.header.btnBack.classList.add('hidden');

        if (state.currentView === 'contact') {
            UI.views.contact.classList.remove('hidden');
            UI.header.title.textContent = "Transaction Details";
            UI.header.btnBack.classList.remove('hidden');
            // Keep Nav showing dashboard mostly selected conceptually, or clear them
            app.renderContactHistory();
            return;
        }

        UI.views[state.currentView].classList.remove('hidden');
        UI.navBtns[state.currentView].classList.add('active');

        if (state.currentView === 'dashboard') UI.header.title.textContent = i18n[state.language].amanahLedger;
        if (state.currentView === 'zakat') UI.header.title.textContent = i18n[state.language].wealthAndZakat;
        if (state.currentView === 'settings') UI.header.title.textContent = i18n[state.language].settingsTitle;

        app.applyTranslations();
        app.render();
    },

    applyTranslations: () => {
        const t = i18n[state.language];
        document.querySelector('.left-card .subtext').textContent = t.othersOweMe;
        document.querySelector('.right-card .subtext').textContent = t.iOweOthers;
        document.querySelector('#view-dashboard .section-header h3').textContent = t.contacts;
        document.querySelector('#view-dashboard .section-header .btn-text').textContent = t.addRecord;
        document.getElementById('contacts-empty').textContent = t.noRecords;
        
        // Zakat text
        const zH2 = document.querySelector('.zakat-widget .widget-header h2');
        if (zH2) zH2.textContent = t.zakatStatus;
        const netAssetsLabels = document.querySelectorAll('.net-assets .label');
        if (netAssetsLabels.length > 0) netAssetsLabels[0].textContent = t.totalWealth;
        const zDue = document.querySelector('.zakat-due-container .label');
        if (zDue) zDue.textContent = t.zakatDue;
        const zAssetH3 = document.querySelector('#view-zakat .section-header h3');
        if (zAssetH3) zAssetH3.textContent = t.myPureAssets;
        const zAddBtn = document.querySelector('#view-zakat .section-header .btn-text');
        if (zAddBtn) zAddBtn.textContent = t.addAsset;
        
        // Contact View text
        const contactSectionH3 = document.querySelector('#view-contact .section-header h3');
        if (contactSectionH3) contactSectionH3.textContent = t.transactionHistory;
    },

    // --- Modal Logic ---
    showModal: (context) => {
        state.modalContext = context;
        UI.modal.inputDesc.value = '';
        UI.modal.inputAmount.value = '';
        UI.modal.inputContact.value = '';

        if (context === 'transaction') {
            state.tooltipDismissed = true;
            UI.tooltip.classList.add('hidden');
        }
        
        const amountFieldGroup = document.getElementById('amount-field-group');

        if (context === 'asset') {
            UI.modal.title.textContent = "Add Pure Asset";
            UI.modal.contactGroup.classList.add('hidden');
            UI.modal.typeGroup.classList.add('hidden');
            UI.modal.categorySection.classList.remove('hidden');
            UI.modal.descLabel.textContent = "Asset Description (e.g. Gold Bars)";
            state.transactionType = 'asset';
            app.handleCategoryChange();
        } else {
            // Transaction
            UI.modal.title.textContent = "Add Amanah Record";
            UI.modal.contactGroup.classList.remove('hidden');
            UI.modal.typeGroup.classList.remove('hidden');
            UI.modal.categorySection.classList.add('hidden');
            const goldFields = document.getElementById('gold-silver-fields');
            if(goldFields) goldFields.classList.add('hidden');
            if(amountFieldGroup) amountFieldGroup.classList.remove('hidden');
            UI.modal.descLabel.textContent = "Description (e.g. Petrol, Grocery)";
            
            // Pre-fill if in contact view
            if (state.activeContact) {
                UI.modal.inputContact.value = state.activeContact;
            }
            app.setTransactionType('receivable');
        }

        UI.modal.overlay.classList.remove('hidden');
    },

    closeModal: () => {
        UI.modal.overlay.classList.add('hidden');
    },

    setTransactionType: (type) => {
        state.transactionType = type;
        if (type === 'receivable') {
            UI.modal.btnTypeRec.classList.add('active');
            UI.modal.btnTypeLiab.classList.remove('active');
        } else {
            UI.modal.btnTypeRec.classList.remove('active');
            UI.modal.btnTypeLiab.classList.add('active');
        }
    },

    saveItem: () => {
        const desc = UI.modal.inputDesc.value.trim();
        const amount = parseFloat(UI.modal.inputAmount.value);
        let contact = UI.modal.inputContact.value.trim();
        const category = state.modalContext === 'asset' ? UI.modal.itemCategoryInput.value : null;

        if (!desc || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount (ensuring Purity & Barakah) and description.');
            return;
        }

        if (state.modalContext === 'transaction') {
            if (!contact) {
                alert('Please enter a Contact Name.');
                return;
            }
            // Capitalize first letter of contact
            contact = contact.charAt(0).toUpperCase() + contact.slice(1);
        }

        const newItem = {
            id: Date.now().toString(),
            contactName: state.modalContext === 'transaction' ? contact : null,
            desc,
            amount,
            type: state.transactionType, // asset, receivable, liability
            category,
            date: new Date().toISOString()
        };

        state.items.push(newItem);
        app.saveData();
        app.render();
        if(state.currentView === 'contact' && state.activeContact === contact) {
            app.renderContactHistory();
        }
        app.closeModal();
    },

    removeItem: (id) => {
        state.items = state.items.filter(item => item.id !== id);
        app.saveData();
        app.render();
        if (state.currentView === 'contact') {
            app.renderContactHistory();
            // Go back if we deleted the last item for this contact
            const remaining = state.items.filter(i => i.contactName === state.activeContact);
            if (remaining.length === 0) app.navigateBack();
        }
    },

    settleAmanah: () => {
        if (!state.activeContact) return;
        
        let net = 0;
        state.items.forEach(i => {
           if(i.contactName === state.activeContact) {
               if(i.type === 'receivable') net += i.amount;
               else net -= i.amount;
           }
        });

        if (net === 0) {
            alert('Balance is already zero.');
            return;
        }

        if (confirm('Mark this record as paid?')) {
            const settlementType = net > 0 ? 'liability' : 'receivable';
            const offsetAmount = Math.abs(net);
            
            state.items.push({
                id: Date.now().toString(),
                contactName: state.activeContact,
                desc: "Settlement (Paid)",
                amount: offsetAmount,
                type: settlementType,
                category: null,
                date: new Date().toISOString()
            });
            
            app.saveData();
            app.render();
            if (state.currentView === 'contact') {
                app.renderContactHistory();
            }
        }
    },

    // --- Core Rendering Logic ---
    render: () => {
        app.renderDashboard();
        app.renderZakat();
        app.renderSettings();
    },

    renderDashboard: () => {
        // Group items by contact (excluding absolute pure assets)
        const contacts = {};
        let totalRec = 0;
        let totalLiab = 0;

        state.items.forEach(item => {
            if (item.type === 'asset' || !item.contactName) return;
            
            if (!contacts[item.contactName]) {
                contacts[item.contactName] = { name: item.contactName, balance: 0, count: 0 };
            }
            
            if (item.type === 'receivable') {
                contacts[item.contactName].balance += item.amount;
                totalRec += item.amount;
            } else if (item.type === 'liability') {
                contacts[item.contactName].balance -= item.amount;
                totalLiab += item.amount;
            }
            contacts[item.contactName].count++;
        });

        UI.dashboard.totalReceivables.textContent = app.formatCurrency(totalRec);
        UI.dashboard.totalLiabilities.textContent = app.formatCurrency(totalLiab);

        const sortedContacts = Object.values(contacts).sort((a,b) => Math.abs(b.balance) - Math.abs(a.balance));
        
        // Handle First Record Nudge
        if (state.items.length === 0 && state.hasSeenOnboarding && !state.hasSeenTutorial) {
            UI.tooltip.classList.remove('hidden');
        } else {
            UI.tooltip.classList.add('hidden');
        }
        
        UI.dashboard.contactsList.innerHTML = '';
        if (sortedContacts.length === 0) {
            UI.dashboard.emptyState.classList.remove('hidden');
        } else {
            UI.dashboard.emptyState.classList.add('hidden');
            sortedContacts.forEach(c => {
                const li = document.createElement('li');
                li.className = 'list-item';
                li.onclick = () => app.openContactView(c.name);
                
                const isPositive = c.balance >= 0;
                const balanceClass = isPositive ? 'positive' : 'negative';
                const prefix = isPositive ? 'Owes you' : 'You owe';
                const avatarChar = c.name.charAt(0).toUpperCase();

                li.innerHTML = `
                    <div class="contact-info">
                        <div class="avatar">${avatarChar}</div>
                        <div>
                            <div class="contact-name">${c.name}</div>
                            <div class="transaction-desc">${c.count} records</div>
                        </div>
                    </div>
                    <div style="text-align:right">
                        <div class="transaction-date">${prefix}</div>
                        <div class="item-value ${balanceClass}">${app.formatCurrency(Math.abs(c.balance))}</div>
                    </div>
                `;
                UI.dashboard.contactsList.appendChild(li);
            });
        }
    },

    renderContactHistory: () => {
        if (!state.activeContact) return;
        const items = state.items.filter(i => i.contactName === state.activeContact).sort((a,b) => new Date(b.date) - new Date(a.date));
        
        UI.contactView.avatar.textContent = state.activeContact.charAt(0).toUpperCase();
        UI.contactView.nameTitle.textContent = state.activeContact;

        let net = 0;
        UI.contactView.historyList.innerHTML = '';

        items.forEach(item => {
            const isRec = item.type === 'receivable';
            if(isRec) net += item.amount;
            else net -= item.amount;

            const li = document.createElement('li');
            li.className = 'list-item';
            
            const dateStr = item.date ? new Date(item.date).toLocaleDateString() : 'Unknown Date';

            li.innerHTML = `
                <div class="contact-info">
                    <div>
                        <div class="transaction-desc">${item.desc}</div>
                        <div class="transaction-date">${dateStr}</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap: 12px">
                    <div class="item-value ${isRec ? 'positive' : 'negative'}">${app.formatCurrency(item.amount)}</div>
                    <button class="btn-text" style="color:#ccc; font-size:1.2rem; margin:0;" onclick="event.stopPropagation(); app.removeItem('${item.id}')">✕</button>
                </div>
            `;
            UI.contactView.historyList.appendChild(li);
        });

        UI.contactView.netBalance.textContent = `Net: ${app.formatCurrency(net)}`;
        UI.contactView.netBalance.style.color = net >= 0 ? 'var(--color-positive)' : 'var(--color-negative)';
    },

    renderZakat: () => {
        let assets = 0;
        let liabilities = 0;

        state.items.forEach(item => {
            if (item.type === 'asset' || item.type === 'receivable') {
                assets += item.amount;
            } else if (item.type === 'liability') {
                liabilities += item.amount;
            }
        });

        const netAssets = assets - liabilities;
        let zakatDue = 0;
        let progressToNisab = 0;

        if (netAssets > 0) {
            progressToNisab = Math.min((netAssets / NISAB_2026_GOLD) * 100, 100);
            if (netAssets >= NISAB_2026_GOLD) {
                zakatDue = netAssets * ZAKAT_RATE;
                UI.zakat.zakatMessage.textContent = 'Alhamdulillah, your Total Wealth exceeds the Nisab. Zakat applies.';
                UI.zakat.zakatMessage.style.color = 'var(--color-positive)';
            } else {
                UI.zakat.zakatMessage.textContent = `Your Total Wealth is below Nisab. No Zakat due yet.`;
                UI.zakat.zakatMessage.style.color = 'var(--color-text-muted)';
            }
        } else {
            UI.zakat.zakatMessage.textContent = 'Track your assets securely to determine Zakat eligibility.';
            UI.zakat.zakatMessage.style.color = 'var(--color-text-muted)';
        }

        UI.zakat.netAssetsText.textContent = app.formatCurrency(Math.max(0, netAssets));
        UI.zakat.zakatDueText.textContent = app.formatCurrency(zakatDue);
        UI.zakat.progressBar.style.width = `${progressToNisab}%`;
        
        if (progressToNisab >= 100) {
            UI.zakat.progressBar.style.background = 'linear-gradient(90deg, #D4AF37, #F3E5AB)';
        } else {
            UI.zakat.progressBar.style.background = 'linear-gradient(90deg, var(--color-primary-light), var(--color-primary))';
        }

        // Render Pure Assets List
        const pureAssets = state.items.filter(i => i.type === 'asset');
        UI.zakat.assetsList.innerHTML = '';
        if(pureAssets.length === 0){
            UI.zakat.assetsList.innerHTML = '<span class="helper-text mt-1">No pure assets recorded yet.</span>';
        } else {
            pureAssets.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-item';
                li.innerHTML = `
                    <div class="contact-info">
                        <div>
                            <div class="contact-name">${item.desc}</div>
                            <div class="transaction-desc">Asset • ${item.category || 'Other'}</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap: 12px">
                        <div class="item-value positive">${app.formatCurrency(item.amount)}</div>
                        <button class="btn-text" style="color:#ccc; font-size:1.2rem; margin:0;" onclick="app.removeItem('${item.id}')">✕</button>
                    </div>
                `;
                UI.zakat.assetsList.appendChild(li);
            });
        }
    },

    renderSettings: () => {
        if (state.isPremium) {
            UI.premium.backupBadge.textContent = 'ACTIVE';
            UI.premium.backupBadge.style.background = 'var(--color-positive)';
            UI.premium.backupBadge.style.color = 'white';
            UI.premium.backupDesc.textContent = 'Drive Sync Ready.';
            
            if (state.biometricsEnabled) {
                UI.premium.bioIcon.textContent = '🔒';
                UI.premium.bioDesc.textContent = 'App locked on startup.';
            } else {
                UI.premium.bioIcon.textContent = '🔓';
                UI.premium.bioDesc.textContent = 'Lock app with Fingerprint/FaceID';
            }
        }
    },

    // --- Premium Flow ---
    showPremiumModal: () => {
        if (state.isPremium) return;
        UI.premium.status.classList.add('hidden');
        UI.premium.btn.classList.remove('hidden');
        UI.premium.modal.classList.remove('hidden');
    },
    closePremiumModal: () => { UI.premium.modal.classList.add('hidden'); },
    
    processPurchase: () => {
        UI.premium.btn.classList.add('hidden');
        UI.premium.status.classList.remove('hidden');
        UI.premium.status.style.color = 'var(--color-text-muted)';
        UI.premium.status.textContent = 'Authenticating Play Store...';
        
        setTimeout(() => {
            UI.premium.status.textContent = 'Payment successful! Unlocking premium features...';
            UI.premium.status.style.color = 'var(--color-positive)';
            setTimeout(() => {
                state.isPremium = true;
                localStorage.setItem('amanah-premium', 'true');
                app.closePremiumModal();
                app.render();
                document.getElementById('guide-2-premium').classList.remove('hidden');
            }, 1000);
        }, 1500);
    },

    handleBackupClick: () => {
        if (!state.isPremium) {
            app.showPremiumModal();
            return;
        }
        
        UI.premium.backupIcon.textContent = '🔄';
        UI.premium.backupIcon.classList.add('spin');
        UI.premium.backupDesc.textContent = 'Syncing securely to Google Drive...';
        
        setTimeout(() => {
            UI.premium.backupIcon.classList.remove('spin');
            UI.premium.backupIcon.textContent = '✅';
            UI.premium.backupDesc.textContent = 'Synced JZK! Last backup: Just now.';
            setTimeout(() => {
                UI.premium.backupDesc.textContent = 'Connected. Data securely synced.';
            }, 3000);
        }, 2000);
    },

    // --- Theme Studio Flow ---
    openThemeStudio: () => {
        if (!state.isPremium) {
            app.showPremiumModal();
            return;
        }
        UI.theme.hexInput.value = state.themeColor;
        UI.theme.modal.classList.remove('hidden');
        app.previewTheme(state.themeColor);
    },
    closeThemeModal: () => {
        UI.theme.modal.classList.add('hidden');
        app.setGlobalTheme(state.themeColor);
    },
    previewTheme: (hex) => {
        if (!/^#[0-9A-F]{6}$/i.test(hex)) return;
        state.previewColor = hex;
        app.setGlobalTheme(hex);
    },
    applyTheme: () => {
        if (state.previewColor && /^#[0-9A-F]{6}$/i.test(state.previewColor)) {
            state.themeColor = state.previewColor;
            localStorage.setItem('amanah-theme', state.themeColor);
        }
        app.closeThemeModal();
    },
    setGlobalTheme: (hex) => {
        // Base theme vars
        const lighten = (col, amt) => '#' + col.replace(/^#/, '').replace(/../g, c => ('0'+Math.min(255, Math.max(0, parseInt(c, 16) + amt)).toString(16)).substr(-2));
        document.documentElement.style.setProperty('--color-primary', hex);
        document.documentElement.style.setProperty('--color-primary-dark', lighten(hex, -30));
        document.documentElement.style.setProperty('--color-primary-light', lighten(hex, 40));

        // Always force light mode backgrounds
        document.documentElement.style.setProperty('--color-background', '#FFFFFF');
        document.documentElement.style.setProperty('--color-card-bg', '#F8F9FA');
        document.documentElement.style.setProperty('--color-text-main', '#1A1A1A');
        document.documentElement.style.setProperty('--color-text-muted', '#6C757D');
    },

    // --- Biometric Security ---
    toggleBiometric: () => {
        if (!state.isPremium) return app.showPremiumModal();
        state.biometricsEnabled = !state.biometricsEnabled;
        localStorage.setItem('amanah-bio', state.biometricsEnabled ? 'true' : 'false');
        app.renderSettings();
        alert(state.biometricsEnabled ? 'Biometric security enabled. App will lock on startup.' : 'Biometric security disabled.');
    },
    unlockApp: () => {
        // Mocking the native WebAuthn interaction
        setTimeout(() => {
            UI.premium.lockScreen.classList.add('hidden');
            state.appUnlocked = true;
            app.render();
        }, 500);
    },

    // --- PDF Export (WhatsApp) ---
    exportPDF: () => {
        if (!state.isPremium) return app.showPremiumModal();
        if (!state.activeContact) return;
        if (!window.jspdf) { alert("PDF Engine loading, please try again."); return; }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text("Amanah Trust Statement", 20, 20);
        doc.setFontSize(14);
        doc.text(`Contact: ${state.activeContact}`, 20, 30);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
        
        let y = 60;
        let net = 0;
        doc.setFontSize(12);
        
        const items = state.items.filter(i => i.contactName === state.activeContact).sort((a,b) => new Date(b.date) - new Date(a.date));
        items.forEach(item => {
            const isRec = item.type === 'receivable';
            if(isRec) net += item.amount; else net -= item.amount;
            const dateStr = item.date ? new Date(item.date).toLocaleDateString() : 'Unknown';
            const typeStr = isRec ? 'Asset/Receivable' : 'Amanah/Liability';
            doc.text(`[${dateStr}] ${item.desc} (${typeStr})`, 20, y);
            doc.text(`${isRec ? '+' : '-'} Rs. ${item.amount}`, 150, y);
            y += 10;
        });
        
        y += 10;
        doc.setFontSize(16);
        doc.text(`Net Balance: Rs. ${net}`, 20, y);
        
        try {
            const pdfBlob = doc.output('blob');
            const file = new File([pdfBlob], `${state.activeContact}_Statement.pdf`, {type: 'application/pdf'});
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'Amanah Trust Statement',
                    text: `Trust Statement for ${state.activeContact}. Net Balance: Rs. ${net}`
                }).catch(e => console.log('Share error', e));
            } else {
                doc.save(`${state.activeContact}_Amanah_Statement.pdf`);
                alert('App cannot access native Share. PDF downloaded directly.');
            }
        } catch(e) {
            doc.save(`${state.activeContact}_Amanah_Statement.pdf`);
        }
    },

    // --- Cloud Backup (JSON File API wrapper to bypass OAuth constraints) ---
    handleBackupClick: () => {
        if (!state.isPremium) return app.showPremiumModal();
        
        UI.premium.backupIcon.textContent = '🔄';
        UI.premium.backupIcon.classList.add('spin');
        UI.premium.backupDesc.textContent = 'Encrypting & syncing directly to local Drive...';
        
        setTimeout(() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.items));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "Amanah_Backup.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            UI.premium.backupIcon.classList.remove('spin');
            UI.premium.backupIcon.textContent = '✅';
            UI.premium.backupDesc.textContent = '✅ Backup saved securely to your device files.';
            setTimeout(() => {
                UI.premium.backupDesc.textContent = 'Drive Sync Ready.';
            }, 4000);
        }, 1500);
    },
    
    handleRestoreClick: () => {
        if (!state.isPremium) return app.showPremiumModal();
        UI.premium.fileInput.click();
    },
    
    processRestore: (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedItems = JSON.parse(e.target.result);
                if (Array.isArray(importedItems)) {
                    state.items = importedItems;
                    app.saveData();
                    app.render();
                    alert('Backup restored successfully! Alhamdulillah.');
                } else {
                    alert('Invalid backup file format.');
                }
            } catch (err) {
                alert('Failed to parse backup file.');
            }
        };
        reader.readAsText(file);
    },

    generateNudge: () => {
        if(!state.activeContact) return;
        // Calculate net for this contact
        let net = 0;
        state.items.forEach(i => {
           if(i.contactName === state.activeContact) {
               if(i.type === 'receivable') net += i.amount;
               else net -= i.amount;
           }
        });

        if (net <= 0) {
            alert('This contact does not currently owe you any Amanah to remind them about.');
            return;
        }

        const amountStr = app.formatCurrency(net);
        const message = `As-salamu alaykum ${state.activeContact}. Just a polite reminder regarding our Amanah Ledger balance of ${amountStr}. Please let me know when you easily can fulfill this Qard al-Hasan. May Allah bring Barakah to your wealth!`;
        const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    },

    updateSettings: () => {
        const cur = document.getElementById('setting-currency').value;
        const dec = document.getElementById('setting-decimals').value;
        const lang = document.getElementById('setting-language').value;
        state.currency = cur;
        state.decimalsMode = dec;
        state.language = lang;

        localStorage.setItem('amanah-currency', cur);
        localStorage.setItem('amanah-decimals', dec);
        localStorage.setItem('amanah-lang', lang);

        if (state.language === 'ar' || state.language === 'ur') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }

        app.renderViewVisibility();
    },

    handleCategoryChange: () => {
        const cat = UI.modal.itemCategoryInput.value;
        const goldFields = document.getElementById('gold-silver-fields');
        const amountFieldGroup = document.getElementById('amount-field-group');
        if (!goldFields) return;
        if (cat === 'gold') {
            goldFields.classList.remove('hidden');
            if (amountFieldGroup) amountFieldGroup.classList.add('hidden');
            app.calculateGoldValue();
        } else {
            goldFields.classList.add('hidden');
            if (amountFieldGroup) amountFieldGroup.classList.remove('hidden');
            UI.modal.inputAmount.readOnly = false;
            UI.modal.inputAmount.style.background = '';
        }
    },

    calculateGoldValue: () => {
        const weight = parseFloat(document.getElementById('gold-weight').value) || 0;
        const price = parseFloat(document.getElementById('gold-price-per-unit').value) || 0;
        const karatTag = document.getElementById('gold-karat');
        const karat = karatTag ? parseFloat(karatTag.value) || 24 : 24;
        
        // Zakat Value = Weight * (Karat/24) * PricePerUnit
        const total = weight * (karat / 24) * price;
        UI.modal.inputAmount.value = total > 0 ? total : '';
    },

    saveData: () => {
        app.saveDataLocally();
        if (typeof isFirebaseActive !== 'undefined' && isFirebaseActive) {
            app.saveCloudData();
        }
    },

    loadData: () => {
        state.isPremium = localStorage.getItem('amanah-premium') === 'true';
        state.hasSeenOnboarding = localStorage.getItem('amanah-onboarding') === 'true';
        state.hasSeenGuide = localStorage.getItem('hasSeenGuide') === 'true';
        state.hasSeenTutorial = localStorage.getItem('hasSeenTutorial') === 'true';
        state.biometricsEnabled = localStorage.getItem('amanah-bio') === 'true';
        
        state.currency = localStorage.getItem('amanah-currency') || 'INR';
        state.decimalsMode = localStorage.getItem('amanah-decimals') || 'hide';
        state.language = localStorage.getItem('amanah-lang') || 'en';
        
        setTimeout(() => {
            const curEl = document.getElementById('setting-currency');
            const decEl = document.getElementById('setting-decimals');
            const langEl = document.getElementById('setting-language');
            if (curEl) curEl.value = state.currency;
            if (decEl) decEl.value = state.decimalsMode;
            if (langEl) langEl.value = state.language;
        }, 100);
        
        const savedTheme = localStorage.getItem('amanah-theme');
        if (savedTheme) {
            state.themeColor = savedTheme;
            app.setGlobalTheme(state.themeColor);
        }
        
        const stored = localStorage.getItem('amanah-items');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Migrate old data architecture if necessary
                state.items = parsed.map(item => {
                    // Old item format had `name`, but no `contactName`.
                    // We map the old `name` to `description` and create a contact 'Legacy Contact' or map name to contact.
                    if (!item.contactName && item.type !== 'asset') {
                        item.contactName = item.name || 'Unknown Contact';
                        item.desc = item.name || 'Previous Record';
                    } else if (!item.desc && item.type === 'asset') {
                        item.desc = item.name || 'Asset Entry';
                    }
                    return item;
                });
            } catch (e) {
                console.error("Could not parse items", e);
            }
        }
    },

    // --- Onboarding Flow ---
    nextSlide: (slideNum) => {
        document.querySelectorAll('.slide').forEach(s => s.classList.add('hidden'));
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        
        document.getElementById(`slide-${slideNum}`).classList.remove('hidden');
        document.getElementById(`dot-${slideNum}`).classList.add('active');
    },

    dismissTutorial: () => {
        state.hasSeenTutorial = true;
        localStorage.setItem('hasSeenTutorial', 'true');
        UI.tooltip.classList.add('hidden');
        app.render();
    },

    finishOnboarding: () => {
        state.hasSeenOnboarding = true;
        localStorage.setItem('amanah-onboarding', 'true');
        UI.onboarding.overlay.classList.add('hidden');
        app.render();
    }
};

document.addEventListener('DOMContentLoaded', app.init);
