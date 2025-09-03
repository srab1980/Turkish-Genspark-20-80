// 🎨 Word SVG Icons System
// Generates contextual SVG icons based on word content and category

class WordSVGIcons {
    constructor() {
        this.iconCache = new Map();
        console.log('🎨 Word SVG Icons system initialized');
    }
    
    /**
     * Get SVG icon for a word based on its Turkish content - WORD-SPECIFIC APPROACH
     */
    getIconForWord(word) {
        const cacheKey = `${word.turkish}_${word.id}`;
        
        if (this.iconCache.has(cacheKey)) {
            return this.iconCache.get(cacheKey);
        }
        
        let svg = null;
        const turkishWord = word.turkish.toLowerCase().trim();
        
        // WORD-SPECIFIC MATCHING - Priority approach for individual words
        svg = this.getSpecificWordIcon(turkishWord);
        
        // If no specific word match, try category-based approach
        if (!svg) {
            if (word.id <= 6) { // Greetings
                svg = this.getGreetingIcon(turkishWord);
            } else if (word.id <= 12) { // Travel  
                svg = this.getTravelIcon(turkishWord);
            } else if (word.id <= 18) { // Food
                svg = this.getFoodIcon(turkishWord);
            } else if (word.id <= 24) { // Shopping
                svg = this.getShoppingIcon(turkishWord);
            } else if (word.id <= 30) { // Directions
                svg = this.getDirectionIcon(turkishWord);
            } else if (word.id <= 36) { // Emergency
                svg = this.getEmergencyIcon(turkishWord);
            } else if (word.id <= 42) { // Time
                svg = this.getTimeIcon(turkishWord);
            } else if (word.id <= 48) { // Numbers
                svg = this.getNumberIcon(turkishWord);
            }
        }
        
        // Final fallback to semantic word analysis
        if (!svg) {
            svg = this.getSemanticWordIcon(turkishWord);
        }
        
        // Ultimate fallback to generic category icon
        if (!svg) {
            svg = this.getGenericCategoryIcon(word.id);
        }
        
        this.iconCache.set(cacheKey, svg);
        return svg;
    }
    
    /**
     * WORD-SPECIFIC ICON MATCHING - Direct word-to-icon mapping
     */
    getSpecificWordIcon(turkishWord) {
        // Comprehensive word-specific mapping
        const wordIconMap = {
            // Greetings & Politeness
            'merhaba': this.createHelloHandIcon(),
            'selam': this.createHelloHandIcon(),
            'günaydın': this.createMorningSunIcon(),
            'iyi sabahlar': this.createMorningSunIcon(),
            'iyi akşamlar': this.createEveningMoonIcon(),
            'iyi geceler': this.createNightIcon(),
            'hoşça kalın': this.createGoodbyeWaveIcon(),
            'görüşürüz': this.createGoodbyeWaveIcon(),
            'lütfen': this.createPleaseHandsIcon(),
            'teşekkür ederim': this.createThankYouHeartIcon(),
            'teşekkürler': this.createThankYouHeartIcon(),
            'özür dilerim': this.createApologyIcon(),
            'pardon': this.createApologyIcon(),
            
            // Travel & Transportation
            'havaalanı': this.createAirportPlaneIcon(),
            'havaalan': this.createAirportPlaneIcon(),
            'uçak': this.createAirportPlaneIcon(),
            'otel': this.createHotelBuildingIcon(),
            'taksi': this.createTaxiCarIcon(),
            'otobüs': this.createBusVehicleIcon(),
            'tren': this.createTrainIcon(),
            'metro': this.createMetroIcon(),
            'bilet': this.createTicketStubIcon(),
            'valiz': this.createSuitcaseIcon(),
            'bagaj': this.createSuitcaseIcon(),
            'pasaport': this.createPassportIcon(),
            'oda': this.createRoomIcon(),
            'rezervasyon': this.createBookingIcon(),
            
            // Food & Drinks
            'su': this.createWaterDropIcon(),
            'ekmek': this.createBreadLoafIcon(),
            'et': this.createMeatSteak(),
            'balık': this.createFishIcon(),
            'sebze': this.createVegetableCarrotIcon(),
            'meyve': this.createFruitAppleIcon(),
            'çay': this.createTeaIcon(),
            'kahve': this.createCoffeeIcon(),
            'süt': this.createMilkIcon(),
            'peynir': this.createCheeseIcon(),
            'yumurta': this.createEggIcon(),
            'tavuk': this.createChickenIcon(),
            'pilav': this.createRiceIcon(),
            'salata': this.createSaladIcon(),
            'meze': this.createMezeIcon(),
            
            // Shopping & Money
            'ne kadar?': this.createQuestionIcon(),
            'ne kadar': this.createQuestionIcon(),
            'kaç para?': this.createQuestionIcon(),
            'çok pahalı': this.createExpensiveIcon(),
            'pahalı': this.createExpensiveIcon(),
            'ucuz': this.createCheapIcon(),
            'para': this.createMoneyIcon(),
            'lira': this.createMoneyIcon(),
            'satın almak': this.createCartIcon(),
            'almak': this.createCartIcon(),
            'mağaza': this.createStoreIcon(),
            'market': this.createStoreIcon(),
            'süpermarket': this.createStoreIcon(),
            'alışveriş': this.createCartIcon(),
            'kart': this.createCreditCardIcon(),
            'kredi kartı': this.createCreditCardIcon(),
            'nakit': this.createCashIcon(),
            
            // Directions & Location
            'nerede?': this.createLocationIcon(),
            'nerede': this.createLocationIcon(),
            'sağ': this.createRightArrowIcon(),
            'sağa': this.createRightArrowIcon(),
            'sol': this.createLeftArrowIcon(),
            'sola': this.createLeftArrowIcon(),
            'ileri': this.createUpArrowIcon(),
            'düz': this.createUpArrowIcon(),
            'geri': this.createDownArrowIcon(),
            'yakın': this.createNearIcon(),
            'uzak': this.createFarIcon(),
            'harita': this.createMapIcon(),
            'adres': this.createAddressIcon(),
            'sokak': this.createStreetIcon(),
            'cadde': this.createStreetIcon(),
            
            // Emergency & Health
            'yardım!': this.createHelpIcon(),
            'yardım': this.createHelpIcon(),
            'polis': this.createPoliceIcon(),
            'doktor': this.createDoctorIcon(),
            'hastane': this.createHospitalIcon(),
            'eczane': this.createPharmacyIcon(),
            'acil': this.createAmbulanceIcon(),
            'ambulans': this.createAmbulanceIcon(),
            'hasta': this.createSickIcon(),
            'ağrı': this.createPainIcon(),
            'baş ağrısı': this.createHeadacheIcon(),
            'ateş': this.createFeverIcon(),
            'ilaç': this.createMedicineIcon(),
            
            // Time & Calendar
            'saat': this.createClockIcon(),
            'zaman': this.createClockIcon(),
            'gün': this.createCalendarDayIcon(),
            'hafta': this.createCalendarWeekIcon(),
            'ay': this.createCalendarMonthIcon(),
            'yıl': this.createCalendarYearIcon(),
            'bugün': this.createTodayIcon(),
            'yarın': this.createTomorrowIcon(),
            'dün': this.createYesterdayIcon(),
            'şimdi': this.createNowIcon(),
            'erken': this.createEarlyIcon(),
            'geç': this.createLateIcon(),
            
            // Numbers (Turkish words)
            'bir': this.createNumberOneIcon(),
            'iki': this.createNumberTwoIcon(),
            'üç': this.createNumberThreeIcon(),
            'dört': this.createNumberFourIcon(),
            'beş': this.createNumberFiveIcon(),
            'altı': this.createNumberSixIcon(),
            'yedi': this.createNumberSevenIcon(),
            'sekiz': this.createNumberEightIcon(),
            'dokuz': this.createNumberNineIcon(),
            'on': this.createNumberTenIcon(),
            'yüz': this.createNumberHundredIcon(),
            'bin': this.createNumberThousandIcon(),
            
            // Common Verbs
            'gitmek': this.createGoIcon(),
            'gelmek': this.createComeIcon(),
            'yapmak': this.createMakeIcon(),
            'görmek': this.createSeeIcon(),
            'duymak': this.createHearIcon(),
            'konuşmak': this.createSpeakIcon(),
            'yemek': this.createEatIcon(),
            'içmek': this.createDrinkIcon(),
            'uyumak': this.createSleepIcon(),
            'çalışmak': this.createWorkIcon(),
            
            // Weather & Nature
            'hava': this.createWeatherIcon(),
            'güneş': this.createSunIcon(),
            'yağmur': this.createRainIcon(),
            'kar': this.createSnowIcon(),
            'rüzgar': this.createWindIcon(),
            'deniz': this.createSeaIcon(),
            'göl': this.createLakeIcon(),
            'dağ': this.createMountainIcon(),
            'orman': this.createForestIcon(),
            'çiçek': this.createFlowerIcon(),
        };
        
        return wordIconMap[turkishWord] || null;
    }
    
    /**
     * SEMANTIC WORD ANALYSIS - Fallback based on word meaning
     */
    getSemanticWordIcon(turkishWord) {
        // Check for semantic patterns and word endings
        if (turkishWord.includes('mek') || turkishWord.includes('mak')) {
            return this.createActionIcon(); // Verb indicator
        }
        
        if (turkishWord.includes('lık') || turkishWord.includes('lik')) {
            return this.createConceptIcon(); // Abstract concept
        }
        
        if (turkishWord.includes('lar') || turkishWord.includes('ler')) {
            return this.createPluralIcon(); // Plural indicator
        }
        
        // Check for question words
        if (turkishWord.startsWith('ne') || turkishWord.startsWith('nasıl') || 
            turkishWord.startsWith('neden') || turkishWord.startsWith('kim')) {
            return this.createQuestionIcon();
        }
        
        // Check for color words
        const colors = ['kırmızı', 'mavi', 'yeşil', 'sarı', 'siyah', 'beyaz', 'pembe', 'mor'];
        if (colors.some(color => turkishWord.includes(color))) {
            return this.createColorIcon();
        }
        
        return null; // No semantic match
    }
    
    /**
     * Greeting-specific icons
     */
    getGreetingIcon(turkishWord) {
        switch (turkishWord) {
            case 'merhaba':
                return this.createHelloHandIcon();
            case 'günaydın':
                return this.createMorningSunIcon();
            case 'iyi akşamlar':
                return this.createEveningMoonIcon();
            case 'hoşça kalın':
                return this.createGoodbyeWaveIcon();
            case 'lütfen':
                return this.createPleaseHandsIcon();
            case 'teşekkür ederim':
                return this.createThankYouHeartIcon();
            default:
                return this.createHelloHandIcon();
        }
    }
    
    /**
     * Travel-specific icons
     */
    getTravelIcon(turkishWord) {
        switch (turkishWord) {
            case 'havaalanı':
                return this.createAirportPlaneIcon();
            case 'otel':
                return this.createHotelBuildingIcon();
            case 'taksi':
                return this.createTaxiCarIcon();
            case 'otobüs':
                return this.createBusVehicleIcon();
            case 'tren':
                return this.createTrainIcon();
            case 'bilet':
                return this.createTicketStubIcon();
            default:
                return this.createAirportPlaneIcon();
        }
    }
    
    /**
     * Food-specific icons
     */
    getFoodIcon(turkishWord) {
        switch (turkishWord) {
            case 'su':
                return this.createWaterDropIcon();
            case 'ekmek':
                return this.createBreadLoafIcon();
            case 'et':
                return this.createMeatSteak();
            case 'balık':
                return this.createFishIcon();
            case 'sebze':
                return this.createVegetableCarrotIcon();
            case 'meyve':
                return this.createFruitAppleIcon();
            default:
                return this.createGenericFoodIcon();
        }
    }
    
    /**
     * Shopping-specific icons
     */
    getShoppingIcon(turkishWord) {
        switch (turkishWord) {
            case 'ne kadar?':
                return this.createQuestionIcon();
            case 'çok pahalı':
                return this.createExpensiveIcon();
            case 'ucuz':
                return this.createCheapIcon();
            case 'para':
                return this.createMoneyIcon();
            case 'satın almak':
                return this.createCartIcon();
            case 'mağaza':
                return this.createStoreIcon();
            default:
                return this.createCartIcon();
        }
    }
    
    /**
     * Direction-specific icons
     */
    getDirectionIcon(turkishWord) {
        switch (turkishWord) {
            case 'nerede?':
                return this.createLocationIcon();
            case 'sağ':
                return this.createRightArrowIcon();
            case 'sol':
                return this.createLeftArrowIcon();
            case 'ileri':
                return this.createUpArrowIcon();
            case 'geri':
                return this.createDownArrowIcon();
            case 'yakın':
                return this.createNearIcon();
            default:
                return this.createCompassIcon();
        }
    }
    
    /**
     * Emergency-specific icons
     */
    getEmergencyIcon(turkishWord) {
        switch (turkishWord) {
            case 'yardım!':
                return this.createHelpIcon();
            case 'polis':
                return this.createPoliceIcon();
            case 'doktor':
                return this.createDoctorIcon();
            case 'hastane':
                return this.createHospitalIcon();
            case 'acil':
                return this.createAmbulanceIcon();
            case 'hasta':
                return this.createSickIcon();
            default:
                return this.createEmergencyIcon();
        }
    }
    
    /**
     * Time-specific icons
     */
    getTimeIcon(turkishWord) {
        switch (turkishWord) {
            case 'saat':
                return this.createClockIcon();
            case 'gün':
                return this.createCalendarDayIcon();
            case 'hafta':
                return this.createCalendarWeekIcon();
            case 'ay':
                return this.createCalendarMonthIcon();
            case 'yıl':
                return this.createCalendarYearIcon();
            case 'bugün':
                return this.createTodayIcon();
            default:
                return this.createClockIcon();
        }
    }
    
    /**
     * Number-specific icons
     */
    getNumberIcon(turkishWord) {
        switch (turkishWord) {
            case 'bir':
                return this.createNumberOneIcon();
            case 'iki':
                return this.createNumberTwoIcon();
            case 'üç':
                return this.createNumberThreeIcon();
            case 'dört':
                return this.createNumberFourIcon();
            case 'beş':
                return this.createNumberFiveIcon();
            case 'on':
                return this.createNumberTenIcon();
            default:
                return this.createNumberIcon();
        }
    }
    
    // SVG Icon Creation Methods
    
    createHelloHandIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"/>
            <path d="M9 10v4"/>
            <path d="M12 8v8"/>
            <path d="M15 9v6"/>
            <circle cx="12" cy="17" r="1"/>
        </svg>`;
    }
    
    createMorningSunIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="4" fill="#FFD700" stroke="#FFA500"/>
            <line x1="12" y1="2" x2="12" y2="4" stroke="#FFA500" stroke-width="3"/>
            <line x1="12" y1="20" x2="12" y2="22" stroke="#FFA500" stroke-width="3"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#FFA500" stroke-width="2"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#FFA500" stroke-width="2"/>
            <line x1="2" y1="12" x2="4" y2="12" stroke="#FFA500" stroke-width="3"/>
            <line x1="20" y1="12" x2="22" y2="12" stroke="#FFA500" stroke-width="3"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#FFA500" stroke-width="2"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#FFA500" stroke-width="2"/>
        </svg>`;
    }
    
    createEveningMoonIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#4A90E2" stroke="#2E5C8A"/>
            <circle cx="6" cy="7" r="0.5" fill="#FFFFFF"/>
            <circle cx="8" cy="5" r="0.3" fill="#FFFFFF"/>
            <circle cx="10" cy="8" r="0.4" fill="#FFFFFF"/>
        </svg>`;
    }
    
    createGoodbyeIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>`;
    }
    
    createPleaseIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
        </svg>`;
    }
    
    createHeartIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>`;
    }
    
    createAirportPlaneIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#3498DB" stroke="#2980B9"/>
        </svg>`;
    }
    
    createHotelBuildingIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="4" width="16" height="16" rx="2" fill="#E74C3C" stroke="#C0392B"/>
            <rect x="6" y="6" width="3" height="2" fill="#F39C12"/>
            <rect x="10" y="6" width="3" height="2" fill="#F39C12"/>
            <rect x="15" y="6" width="3" height="2" fill="#F39C12"/>
            <rect x="6" y="9" width="3" height="2" fill="#F39C12"/>
            <rect x="10" y="9" width="3" height="2" fill="#F39C12"/>
            <rect x="15" y="9" width="3" height="2" fill="#F39C12"/>
            <rect x="10" y="15" width="4" height="5" fill="#8B4513"/>
            <circle cx="12" cy="17" r="0.5" fill="#FFD700"/>
        </svg>`;
    }
    
    createTaxiCarIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="3" y="11" width="18" height="7" rx="1" fill="#F1C40F" stroke="#D4AC0D"/>
            <rect x="4" y="8" width="16" height="3" fill="#F1C40F" stroke="#D4AC0D"/>
            <rect x="6" y="6" width="12" height="2" fill="#E8F6F3" stroke="#A9DFBF"/>
            <rect x="8" y="4" width="2" height="2" fill="#000000"/>
            <text x="9" y="6" font-size="3" fill="#000000">TAXI</text>
            <circle cx="7" cy="16" r="1.5" fill="#2C3E50"/>
            <circle cx="17" cy="16" r="1.5" fill="#2C3E50"/>
            <circle cx="7" cy="16" r="0.8" fill="#BDC3C7"/>
            <circle cx="17" cy="16" r="0.8" fill="#BDC3C7"/>
        </svg>`;
    }
    
    createBusIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 6v6"/>
            <path d="M16 6v6"/>
            <path d="M2 12h19l1-7H1z"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
            <path d="M5 17h2m8 0h2"/>
        </svg>`;
    }
    
    createTrainIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <circle cx="8.5" cy="16.5" r="1.5"/>
            <circle cx="15.5" cy="16.5" r="1.5"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
        </svg>`;
    }
    
    createTicketIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
            <line x1="13" y1="5" x2="13" y2="7"/>
            <line x1="13" y1="17" x2="13" y2="19"/>
            <line x1="13" y1="11" x2="13" y2="13"/>
        </svg>`;
    }
    
    createWaterDropIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#3498DB" stroke="#2980B9"/>
            <ellipse cx="10" cy="10" rx="2" ry="1" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="9" cy="9" r="0.5" fill="#FFFFFF" opacity="0.8"/>
        </svg>`;
    }
    
    createBreadLoafIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="15" rx="9" ry="6" fill="#D2691E" stroke="#8B4513"/>
            <ellipse cx="12" cy="13" rx="8" ry="4" fill="#F4A460" stroke="#CD853F"/>
            <path d="M5 13 Q8 10, 12 11 Q16 12, 19 13" stroke="#8B4513" stroke-width="0.5" fill="none"/>
            <path d="M6 15 Q9 14, 12 15 Q15 16, 18 15" stroke="#8B4513" stroke-width="0.5" fill="none"/>
            <ellipse cx="8" cy="12" rx="0.5" ry="0.3" fill="#8B4513"/>
            <ellipse cx="14" cy="12" rx="0.5" ry="0.3" fill="#8B4513"/>
            <ellipse cx="11" cy="14" rx="0.4" ry="0.2" fill="#8B4513"/>
        </svg>`;
    }
    
    createMeatSteak() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="12" rx="7" ry="5" fill="#A0522D" stroke="#8B4513"/>
            <ellipse cx="12" cy="11" rx="6" ry="4" fill="#CD853F" stroke="#A0522D"/>
            <ellipse cx="11" cy="10" rx="4" ry="2.5" fill="#E4717A" stroke="#CD5C5C"/>
            <ellipse cx="13" cy="12" rx="2" ry="1.5" fill="#DC143C" stroke="#B22222"/>
            <path d="M8 10 Q10 8, 12 9" stroke="#8B4513" stroke-width="0.5" fill="none"/>
            <path d="M14 13 Q16 11, 17 12" stroke="#8B4513" stroke-width="0.5" fill="none"/>
        </svg>`;
    }
    
    createFishIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6.5 12c.94-3.46 4.94-6 8.5-6s7.56 2.54 8.5 6c-.94 3.47-4.94 6-8.5 6s-7.56-2.53-8.5-6z"/>
            <path d="M18 12v.5"/>
            <path d="M16 17.93a9.77 9.77 0 0 1 0 0"/>
            <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5.5 0 7 2.85-.47 4.27-2.5 4.27-5.17z"/>
            <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h0c0 1.76.02 4.24 0 6z"/>
        </svg>`;
    }
    
    createVegetableIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9-.5 2.5-1"/>
            <path d="M19.5 12.5c-.1-.3-.1-.5-.2-1-.1-1.1-.3-2.3-.6-3.3-.3-.9-.7-1.9-1.3-2.2s-1.3-.2-1.9 0c-.6.3-1.1.8-1.5 1.3-.4-.4-.8-.8-1.4-1.1s-1.3-.4-1.9-.3-1.1.4-1.3 1c-.3.7 0 1.6.5 2.3H9.7c-.5-.7-.2-1.6.5-2.3.2-.6.7-.9 1.3-1s1.3.1 1.9.3c.6.3 1 .7 1.4 1.1.4-.5.9-1 1.5-1.3.6-.2 1.3-.3 1.9 0s1 1.3 1.3 2.2c.3 1 .5 2.2.6 3.3.1.5.1.7.2 1z"/>
        </svg>`;
    }
    
    createFruitIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a3 3 0 0 0-3 3c0 3.31-2.69 6-6 6a3 3 0 1 0 3 3c0 3.31 2.69 6 6 6s6-2.69 6-6a3 3 0 1 0 3-3c-3.31 0-6-2.69-6-6a3 3 0 0 0-3-3Z"/>
            <path d="M19 13v.5"/>
        </svg>`;
    }
    
    createFoodIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/>
            <line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>`;
    }
    
    // Add more icon creation methods for other categories...
    // (Shopping, Direction, Emergency, Time, Numbers)
    
    createQuestionIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`;
    }
    
    createMoneyIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>`;
    }
    
    createCartIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>`;
    }
    
    createClockIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
        </svg>`;
    }
    
    createNumberOneIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <path d="M12 8v8"/>
            <path d="M10 8l2-2 2 2"/>
        </svg>`;
    }
    
    // Generic fallback icons
    getGenericCategoryIcon(wordId) {
        if (wordId <= 6) return this.createHandWaveIcon();
        if (wordId <= 12) return this.createAirportIcon();
        if (wordId <= 18) return this.createFoodIcon();
        if (wordId <= 24) return this.createCartIcon();
        if (wordId <= 30) return this.createCompassIcon();
        if (wordId <= 36) return this.createEmergencyIcon();
        if (wordId <= 42) return this.createClockIcon();
        if (wordId <= 48) return this.createNumberIcon();
        return this.createDefaultIcon();
    }
    
    createCompassIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
        </svg>`;
    }
    
    createEmergencyIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`;
    }
    
    createNumberIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="9" x2="20" y2="9"/>
            <line x1="4" y1="15" x2="20" y2="15"/>
            <line x1="10" y1="3" x2="8" y2="21"/>
            <line x1="16" y1="3" x2="14" y2="21"/>
        </svg>`;
    }
    
    createDefaultIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
        </svg>`;
    }
    
    // Additional word-specific icon methods
    createGoodbyeWaveIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="none" stroke="#3498DB" stroke-width="2"/>
            <polyline points="16,17 21,12 16,7" fill="none" stroke="#3498DB" stroke-width="2"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="#3498DB" stroke-width="2"/>
            <path d="M7 8 Q9 6, 11 8 Q13 10, 11 12 Q9 10, 7 8" fill="#F39C12" stroke="#E67E22"/>
        </svg>`;
    }
    
    createNightIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#2C3E50" stroke="#1A252F"/>
            <circle cx="16" cy="7" r="0.5" fill="#FFFFFF"/>
            <circle cx="18" cy="5" r="0.3" fill="#FFFFFF"/>
            <circle cx="14" cy="5" r="0.4" fill="#FFFFFF"/>
            <circle cx="17" cy="9" r="0.3" fill="#FFFFFF"/>
        </svg>`;
    }
    
    createApologyIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#E74C3C" stroke="#C0392B" opacity="0.8"/>
            <path d="M9 12h6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
            <circle cx="9" cy="9" r="1" fill="#FFFFFF"/>
            <circle cx="15" cy="9" r="1" fill="#FFFFFF"/>
            <path d="M8 15 Q12 18, 16 15" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        </svg>`;
    }
    
    createMetroIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="5" y="4" width="14" height="14" rx="2" fill="#3498DB" stroke="#2980B9"/>
            <rect x="7" y="6" width="4" height="3" fill="#FFFFFF"/>
            <rect x="13" y="6" width="4" height="3" fill="#FFFFFF"/>
            <rect x="7" y="10" width="10" height="2" fill="#FFFFFF"/>
            <circle cx="8" cy="16" r="1.5" fill="#2C3E50"/>
            <circle cx="16" cy="16" r="1.5" fill="#2C3E50"/>
            <text x="12" y="8" text-anchor="middle" font-size="2" fill="#2980B9" font-weight="bold">M</text>
        </svg>`;
    }
    
    createSuitcaseIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="8" width="16" height="12" rx="2" fill="#8B4513" stroke="#654321"/>
            <rect x="6" y="6" width="12" height="2" fill="#A0522D" stroke="#8B4513"/>
            <rect x="9" y="4" width="6" height="2" fill="#D2691E" stroke="#A0522D"/>
            <circle cx="19" cy="14" r="0.8" fill="#FFD700"/>
            <line x1="4" y1="12" x2="20" y2="12" stroke="#654321" stroke-width="0.5"/>
            <line x1="4" y1="16" x2="20" y2="16" stroke="#654321" stroke-width="0.5"/>
        </svg>`;
    }
    
    createPassportIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="6" y="3" width="12" height="18" rx="1" fill="#8B0000" stroke="#660000"/>
            <rect x="8" y="5" width="8" height="6" fill="#FFD700" stroke="#FFA500"/>
            <text x="12" y="8" text-anchor="middle" font-size="2" fill="#8B0000" font-weight="bold">PASS</text>
            <text x="12" y="10" text-anchor="middle" font-size="1.5" fill="#8B0000">PORT</text>
            <rect x="8" y="12" width="8" height="1" fill="#FFFFFF" opacity="0.8"/>
            <rect x="8" y="14" width="6" height="0.5" fill="#FFFFFF" opacity="0.6"/>
            <rect x="8" y="16" width="7" height="0.5" fill="#FFFFFF" opacity="0.6"/>
        </svg>`;
    }
    
    createRoomIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="3" y="6" width="18" height="12" fill="#F5F5DC" stroke="#D2B48C"/>
            <rect x="5" y="12" width="6" height="6" fill="#8B4513" stroke="#654321"/>
            <rect x="13" y="8" width="6" height="4" fill="#87CEEB" stroke="#4682B4"/>
            <circle cx="10" cy="15" r="0.3" fill="#FFD700"/>
            <rect x="15" y="18" width="4" height="1" fill="#2F4F4F"/>
        </svg>`;
    }
    
    createBookingIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="5" width="16" height="14" rx="2" fill="#FFFFFF" stroke="#D3D3D3"/>
            <rect x="6" y="7" width="12" height="2" fill="#4CAF50" stroke="#45A049"/>
            <rect x="6" y="10" width="8" height="1" fill="#E0E0E0"/>
            <rect x="6" y="12" width="10" height="1" fill="#E0E0E0"/>
            <rect x="6" y="14" width="6" height="1" fill="#E0E0E0"/>
            <circle cx="17" cy="13" r="1.5" fill="#4CAF50" stroke="#45A049"/>
            <path d="M16 13 L16.7 13.7 L18 12.4" stroke="#FFFFFF" stroke-width="0.5" fill="none"/>
        </svg>`;
    }
    
    createTeaIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="16" rx="5" ry="6" fill="#8B4513" stroke="#654321"/>
            <ellipse cx="12" cy="14" rx="4.5" ry="5" fill="#D2691E" stroke="#A0522D"/>
            <ellipse cx="12" cy="12" rx="4" ry="3" fill="#F4A460" stroke="#D2691E"/>
            <path d="M17 13 Q19 13, 19 15 Q19 17, 17 17" fill="none" stroke="#654321" stroke-width="1"/>
            <path d="M9 8 Q10 6, 11 8 Q12 6, 13 8 Q14 6, 15 8" fill="none" stroke="#D2691E" stroke-width="0.8" opacity="0.7"/>
        </svg>`;
    }
    
    createCoffeeIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="16" rx="5" ry="6" fill="#4A4A4A" stroke="#2C2C2C"/>
            <ellipse cx="12" cy="14" rx="4.5" ry="5" fill="#654321" stroke="#4A4A4A"/>
            <ellipse cx="12" cy="12" rx="4" ry="3" fill="#8B4513" stroke="#654321"/>
            <path d="M17 13 Q19 13, 19 15 Q19 17, 17 17" fill="none" stroke="#4A4A4A" stroke-width="1"/>
            <path d="M9 8 Q10 6, 11 8 Q12 6, 13 8 Q14 6, 15 8" fill="none" stroke="#8B4513" stroke-width="0.8" opacity="0.7"/>
            <ellipse cx="10" cy="10" rx="1" ry="0.5" fill="#FFFFFF" opacity="0.3"/>
        </svg>`;
    }
    
    createMilkIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M8 4 L16 4 L16 6 L15 8 L15 20 L9 20 L9 8 Z" fill="#FFFFFF" stroke="#D3D3D3"/>
            <rect x="9" y="6" width="6" height="12" fill="#F0F8FF" stroke="#E0E6FF"/>
            <text x="12" y="12" text-anchor="middle" font-size="3" fill="#4169E1" font-weight="bold">M</text>
            <ellipse cx="12" cy="16" rx="2.5" ry="1" fill="#FFFFFF" opacity="0.8"/>
        </svg>`;
    }
    
    createCheeseIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M4 12 L12 4 L20 12 L20 18 L4 18 Z" fill="#FFD700" stroke="#FFA500"/>
            <circle cx="8" cy="14" r="0.8" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="14" cy="13" r="0.6" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="11" cy="16" r="0.5" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="16" cy="15" r="0.4" fill="#FFFFFF" opacity="0.7"/>
            <path d="M4 18 L20 18" stroke="#E6AC00" stroke-width="1"/>
        </svg>`;
    }
    
    createEggIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="13" rx="5" ry="7" fill="#FFFFFF" stroke="#F0F0F0"/>
            <ellipse cx="12" cy="13" rx="4.5" ry="6.5" fill="#FFFAF0" stroke="#F5F5DC"/>
            <ellipse cx="10" cy="10" rx="1" ry="1.5" fill="#FFE4B5" opacity="0.3"/>
            <ellipse cx="14" cy="11" rx="0.8" ry="1.2" fill="#FFE4B5" opacity="0.3"/>
        </svg>`;
    }
    
    createPleaseHandsIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M6 10c0-4 3-6 6-6s6 2 6 6" fill="none" stroke="#E74C3C" stroke-width="2"/>
            <path d="M12 4v8" stroke="#E74C3C" stroke-width="2"/>
            <circle cx="8" cy="14" r="3" fill="#F39C12" stroke="#E67E22"/>
            <circle cx="16" cy="14" r="3" fill="#F39C12" stroke="#E67E22"/>
            <path d="M8 17c0 2 1.5 3 4 3s4-1 4-3" fill="none" stroke="#27AE60" stroke-width="2"/>
        </svg>`;
    }
    
    createThankYouHeartIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#E74C3C" stroke="#C0392B"/>
            <circle cx="9" cy="9" r="1" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="15" cy="9" r="1" fill="#FFFFFF" opacity="0.7"/>
        </svg>`;
    }
    
    createBusVehicleIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="6" width="16" height="10" rx="2" fill="#3498DB" stroke="#2980B9"/>
            <rect x="6" y="8" width="3" height="3" fill="#F39C12" stroke="#E67E22"/>
            <rect x="10" y="8" width="4" height="3" fill="#F39C12" stroke="#E67E22"/>
            <rect x="15" y="8" width="3" height="3" fill="#F39C12" stroke="#E67E22"/>
            <rect x="8" y="12" width="8" height="2" fill="#FFFFFF"/>
            <circle cx="7" cy="18" r="2" fill="#2C3E50"/>
            <circle cx="17" cy="18" r="2" fill="#2C3E50"/>
            <circle cx="7" cy="18" r="1" fill="#BDC3C7"/>
            <circle cx="17" cy="18" r="1" fill="#BDC3C7"/>
        </svg>`;
    }
    
    createTicketStubIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="6" width="16" height="12" rx="2" fill="#F39C12" stroke="#E67E22"/>
            <circle cx="4" cy="12" r="1.5" fill="#FFFFFF"/>
            <circle cx="20" cy="12" r="1.5" fill="#FFFFFF"/>
            <line x1="12" y1="6" x2="12" y2="18" stroke="#E67E22" stroke-width="1" stroke-dasharray="2,2"/>
            <rect x="6" y="8" width="4" height="1" fill="#2C3E50"/>
            <rect x="6" y="10" width="4" height="1" fill="#2C3E50"/>
            <rect x="14" y="8" width="4" height="1" fill="#2C3E50"/>
            <rect x="14" y="15" width="4" height="1" fill="#2C3E50"/>
        </svg>`;
    }
    
    createVegetableCarrotIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M8 6 L12 18 L16 6 Z" fill="#FF6B35" stroke="#E55A2B"/>
            <path d="M10 4 Q12 2, 14 4 Q12 5, 10 4" fill="#27AE60" stroke="#229954"/>
            <line x1="10" y1="8" x2="14" y2="8" stroke="#D35400" stroke-width="0.5"/>
            <line x1="10" y1="12" x2="14" y2="12" stroke="#D35400" stroke-width="0.5"/>
            <line x1="11" y1="16" x2="13" y2="16" stroke="#D35400" stroke-width="0.5"/>
        </svg>`;
    }
    
    createFruitAppleIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="14" r="6" fill="#E74C3C" stroke="#C0392B"/>
            <path d="M9 8 Q12 5, 15 8" fill="none" stroke="#27AE60" stroke-width="2"/>
            <ellipse cx="10" cy="11" rx="1" ry="2" fill="#F8C471" opacity="0.6"/>
            <path d="M12 3 Q10 5, 12 7" fill="none" stroke="#8B4513" stroke-width="2"/>
        </svg>`;
    }
    
    createGenericFoodIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="16" rx="8" ry="5" fill="#F39C12" stroke="#E67E22"/>
            <ellipse cx="12" cy="14" rx="6" ry="3" fill="#F1C40F" stroke="#F39C12"/>
            <circle cx="9" cy="12" r="1" fill="#E67E22"/>
            <circle cx="15" cy="12" r="1" fill="#E67E22"/>
            <circle cx="12" cy="13" r="0.5" fill="#E67E22"/>
        </svg>`;
    }
    
    // Additional food icons
    createChickenIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="14" rx="6" ry="4" fill="#F4A460" stroke="#D2691E"/>
            <ellipse cx="10" cy="12" rx="3" ry="2" fill="#DEB887" stroke="#D2691E"/>
            <circle cx="8" cy="10" r="1.5" fill="#F5DEB3" stroke="#D2691E"/>
            <path d="M6 9 Q4 8, 5 10" fill="#FF6347" stroke="#DC143C"/>
            <circle cx="7" cy="9" r="0.3" fill="#000000"/>
            <path d="M10 16 L12 18 L14 16" stroke="#D2691E" stroke-width="1" fill="none"/>
        </svg>`;
    }
    
    createRiceIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="16" rx="7" ry="5" fill="#F5F5DC" stroke="#D3D3D3"/>
            <ellipse cx="12" cy="14" rx="6" ry="3" fill="#FFFAF0" stroke="#F5F5DC"/>
            <circle cx="9" cy="13" r="0.3" fill="#E6E6FA"/>
            <circle cx="15" cy="13" r="0.3" fill="#E6E6FA"/>
            <circle cx="12" cy="12" r="0.3" fill="#E6E6FA"/>
            <circle cx="10" cy="15" r="0.2" fill="#E6E6FA"/>
            <circle cx="14" cy="15" r="0.2" fill="#E6E6FA"/>
        </svg>`;
    }
    
    createSaladIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="16" rx="7" ry="5" fill="#FFFFFF" stroke="#D3D3D3"/>
            <circle cx="9" cy="12" r="1.5" fill="#228B22" stroke="#006400"/>
            <circle cx="15" cy="13" r="1.2" fill="#32CD32" stroke="#228B22"/>
            <circle cx="12" cy="14" r="1" fill="#FF6347" stroke="#DC143C"/>
            <circle cx="14" cy="11" r="0.8" fill="#FFD700" stroke="#FFA500"/>
            <circle cx="10" cy="15" r="0.6" fill="#FF4500" stroke="#DC143C"/>
        </svg>`;
    }
    
    createMezeIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="8" cy="8" r="3" fill="#8FBC8F" stroke="#556B2F"/>
            <circle cx="16" cy="8" r="3" fill="#F0E68C" stroke="#BDB76B"/>
            <circle cx="8" cy="16" r="3" fill="#DDA0DD" stroke="#9370DB"/>
            <circle cx="16" cy="16" r="3" fill="#FF6347" stroke="#DC143C"/>
            <circle cx="8" cy="8" r="1" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="16" cy="8" r="1" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="8" cy="16" r="1" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="16" cy="16" r="1" fill="#FFFFFF" opacity="0.7"/>
        </svg>`;
    }
    
    // Shopping icons
    createExpensiveIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="6" y="8" width="12" height="8" rx="2" fill="#E74C3C" stroke="#C0392B"/>
            <text x="12" y="13" text-anchor="middle" font-size="4" fill="#FFFFFF" font-weight="bold">$$$</text>
            <path d="M9 6 Q12 3, 15 6" fill="none" stroke="#E74C3C" stroke-width="2"/>
            <path d="M6 18 Q12 21, 18 18" fill="none" stroke="#E74C3C" stroke-width="2"/>
        </svg>`;
    }
    
    createCheapIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="6" y="8" width="12" height="8" rx="2" fill="#27AE60" stroke="#229954"/>
            <text x="12" y="13" text-anchor="middle" font-size="5" fill="#FFFFFF" font-weight="bold">$</text>
            <path d="M9 6 Q12 9, 15 6" fill="none" stroke="#27AE60" stroke-width="2"/>
            <path d="M6 18 Q12 15, 18 18" fill="none" stroke="#27AE60" stroke-width="2"/>
        </svg>`;
    }
    
    createCreditCardIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="3" y="7" width="18" height="10" rx="2" fill="#4169E1" stroke="#191970"/>
            <rect x="3" y="9" width="18" height="2" fill="#000000"/>
            <rect x="5" y="13" width="8" height="1" fill="#FFFFFF"/>
            <rect x="5" y="15" width="6" height="0.8" fill="#FFFFFF"/>
            <circle cx="18" cy="15" r="1" fill="#FFD700" stroke="#FFA500"/>
        </svg>`;
    }
    
    createCashIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="8" width="16" height="8" rx="1" fill="#228B22" stroke="#006400"/>
            <circle cx="12" cy="12" r="2.5" fill="#32CD32" stroke="#228B22"/>
            <text x="12" y="13" text-anchor="middle" font-size="2.5" fill="#006400" font-weight="bold">₺</text>
            <rect x="6" y="6" width="12" height="1" fill="#32CD32" opacity="0.7"/>
            <rect x="6" y="17" width="12" height="1" fill="#32CD32" opacity="0.7"/>
        </svg>`;
    }
    
    // Direction icons
    createRightArrowIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M12 4l8 8-8 8" fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 12h16" stroke="#4CAF50" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }
    
    createLeftArrowIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M12 20l-8-8 8-8" fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 12H4" stroke="#4CAF50" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }
    
    createUpArrowIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M4 12l8-8 8 8" fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 20V4" stroke="#4CAF50" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }
    
    createDownArrowIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M20 12l-8 8-8-8" fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 4v16" stroke="#4CAF50" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }
    
    createNearIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="8" fill="none" stroke="#4CAF50" stroke-width="2" stroke-dasharray="4,4"/>
            <circle cx="12" cy="12" r="2" fill="#4CAF50" stroke="#45A049"/>
            <text x="12" y="6" text-anchor="middle" font-size="3" fill="#4CAF50" font-weight="bold">YAKIN</text>
        </svg>`;
    }
    
    createFarIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#FF5722" stroke-width="2" stroke-dasharray="8,4"/>
            <circle cx="12" cy="12" r="6" fill="none" stroke="#FF5722" stroke-width="1" stroke-dasharray="6,2"/>
            <circle cx="12" cy="12" r="2" fill="#FF5722" stroke="#E64A19"/>
            <text x="12" y="6" text-anchor="middle" font-size="2.5" fill="#FF5722" font-weight="bold">UZAK</text>
        </svg>`;
    }
    
    // Additional comprehensive icon methods for complete word-specific coverage
    createMapIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="3" y="4" width="18" height="16" rx="2" fill="#F5F5DC" stroke="#D2B48C"/>
            <path d="M6 8 Q10 6, 14 8 Q18 10, 18 8" fill="none" stroke="#228B22" stroke-width="2"/>
            <path d="M8 12 Q12 10, 16 12" fill="none" stroke="#4169E1" stroke-width="1.5"/>
            <circle cx="10" cy="10" r="1" fill="#E74C3C"/>
            <circle cx="15" cy="14" r="1" fill="#E74C3C"/>
        </svg>`;
    }
    
    createAddressIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="6" width="16" height="12" rx="2" fill="#FFFFFF" stroke="#D3D3D3"/>
            <rect x="6" y="8" width="12" height="1" fill="#4169E1"/>
            <rect x="6" y="10" width="8" height="0.8" fill="#666666"/>
            <rect x="6" y="12" width="10" height="0.8" fill="#666666"/>
            <rect x="6" y="14" width="6" height="0.8" fill="#666666"/>
            <circle cx="17" cy="13" r="1.5" fill="#E74C3C"/>
        </svg>`;
    }
    
    createStreetIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="2" y="10" width="20" height="4" fill="#708090" stroke="#2F4F4F"/>
            <rect x="2" y="12" width="20" height="0.5" fill="#FFFFFF" stroke-dasharray="2,2"/>
            <rect x="4" y="4" width="3" height="6" fill="#8B4513" stroke="#654321"/>
            <rect x="17" y="4" width="3" height="6" fill="#8B4513" stroke="#654321"/>
            <rect x="4.5" y="6" width="2" height="2" fill="#87CEEB"/>
            <rect x="17.5" y="6" width="2" height="2" fill="#87CEEB"/>
        </svg>`;
    }
    
    createPharmacyIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#00AA00"/>
            <rect x="11" y="9" width="2" height="6" fill="#00AA00"/>
            <rect x="9" y="11" width="6" height="2" fill="#00AA00"/>
            <circle cx="12" cy="12" r="8" fill="none" stroke="#00AA00" stroke-width="3"/>
        </svg>`;
    }
    
    createPainIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M12 3 L15 9 L21 9 L16 14 L18 21 L12 17 L6 21 L8 14 L3 9 L9 9 Z" fill="#FF4500" stroke="#DC143C"/>
            <circle cx="12" cy="12" r="3" fill="#FFD700" stroke="#FFA500"/>
            <path d="M9 12 Q12 8, 15 12" fill="none" stroke="#DC143C" stroke-width="2"/>
        </svg>`;
    }
    
    createHeadacheIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="10" r="6" fill="#F0E68C" stroke="#DAA520"/>
            <circle cx="9" cy="8" r="0.5" fill="#000000"/>
            <circle cx="15" cy="8" r="0.5" fill="#000000"/>
            <path d="M9 12 Q12 14, 15 12" fill="none" stroke="#8B0000" stroke-width="2"/>
            <path d="M8 6 L10 4 M14 4 L16 6" stroke="#FF0000" stroke-width="3" stroke-linecap="round"/>
            <path d="M6 8 L8 6 M16 6 L18 8" stroke="#FF0000" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }
    
    createFeverIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="10" y="8" width="4" height="12" rx="2" fill="#E0E0E0" stroke="#CCCCCC"/>
            <circle cx="12" cy="18" r="3" fill="#FF4500" stroke="#DC143C"/>
            <rect x="11" y="10" width="2" height="8" fill="#FF4500"/>
            <text x="12" y="5" text-anchor="middle" font-size="3" fill="#FF0000">°C</text>
        </svg>`;
    }
    
    createMedicineIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="8" y="6" width="8" height="12" rx="2" fill="#FFFFFF" stroke="#00AA00"/>
            <rect x="10" y="8" width="4" height="8" fill="#00AA00"/>
            <circle cx="10" cy="10" r="0.8" fill="#FFFFFF"/>
            <circle cx="14" cy="10" r="0.8" fill="#FFFFFF"/>
            <circle cx="10" cy="14" r="0.8" fill="#FFFFFF"/>
            <circle cx="14" cy="14" r="0.8" fill="#FFFFFF"/>
        </svg>`;
    }
    
    // Time icons
    createTomorrowIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="8" fill="#87CEEB" stroke="#4682B4"/>
            <path d="M12 6 L12 12 L16 14" stroke="#000080" stroke-width="2" stroke-linecap="round"/>
            <path d="M18 6 L20 8 L18 10" fill="#4CAF50" stroke="#45A049"/>
        </svg>`;
    }
    
    createYesterdayIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="8" fill="#D3D3D3" stroke="#A9A9A9"/>
            <path d="M12 6 L12 12 L8 14" stroke="#696969" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 6 L4 8 L6 10" fill="#FF5722" stroke="#E64A19"/>
        </svg>`;
    }
    
    createNowIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="8" fill="#FFD700" stroke="#FFA500"/>
            <circle cx="12" cy="12" r="1.5" fill="#FF4500"/>
            <path d="M12 6 L12 12" stroke="#FF4500" stroke-width="3" stroke-linecap="round"/>
            <path d="M12 12 L16 12" stroke="#FF4500" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }
    
    createEarlyIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="8" fill="#90EE90" stroke="#32CD32"/>
            <path d="M12 6 L12 12 L8 10" stroke="#006400" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 8 L6 6 L8 8" fill="#228B22" stroke="#006400"/>
        </svg>`;
    }
    
    createLateIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="8" fill="#FFA07A" stroke="#FF6347"/>
            <path d="M12 6 L12 12 L16 16" stroke="#DC143C" stroke-width="2" stroke-linecap="round"/>
            <path d="M20 8 L18 6 L16 8" fill="#B22222" stroke="#8B0000"/>
        </svg>`;
    }
    
    // Number icons (2-10)
    createNumberTwoIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#4169E1" stroke="#191970"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#FFFFFF" font-weight="bold">2</text>
        </svg>`;
    }
    
    createNumberThreeIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#32CD32" stroke="#228B22"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#FFFFFF" font-weight="bold">3</text>
        </svg>`;
    }
    
    createNumberFourIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#FFD700" stroke="#FFA500"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#000000" font-weight="bold">4</text>
        </svg>`;
    }
    
    createNumberFiveIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#FF6347" stroke="#DC143C"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#FFFFFF" font-weight="bold">5</text>
        </svg>`;
    }
    
    createNumberSixIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#9370DB" stroke="#663399"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#FFFFFF" font-weight="bold">6</text>
        </svg>`;
    }
    
    createNumberSevenIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#FF69B4" stroke="#DB7093"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#FFFFFF" font-weight="bold">7</text>
        </svg>`;
    }
    
    createNumberEightIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#20B2AA" stroke="#008B8B"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#FFFFFF" font-weight="bold">8</text>
        </svg>`;
    }
    
    createNumberNineIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#F4A460" stroke="#D2691E"/>
            <text x="12" y="16" text-anchor="middle" font-size="8" fill="#000000" font-weight="bold">9</text>
        </svg>`;
    }
    
    createNumberTenIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#708090" stroke="#2F4F4F"/>
            <text x="12" y="16" text-anchor="middle" font-size="6" fill="#FFFFFF" font-weight="bold">10</text>
        </svg>`;
    }
    
    createNumberHundredIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#B8860B" stroke="#8B7355"/>
            <text x="12" y="16" text-anchor="middle" font-size="4" fill="#FFFFFF" font-weight="bold">100</text>
        </svg>`;
    }
    
    createNumberThousandIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#4B0082" stroke="#301934"/>
            <text x="12" y="14" text-anchor="middle" font-size="3" fill="#FFFFFF" font-weight="bold">1K</text>
        </svg>`;
    }
    
    // Common action icons
    createGoIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#4CAF50" stroke="#45A049"/>
            <path d="M8 12 L16 12 M13 8 L16 12 L13 16" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
    
    createComeIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#2196F3" stroke="#1976D2"/>
            <path d="M16 12 L8 12 M11 8 L8 12 L11 16" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
    
    createMakeIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#FF9800" stroke="#F57C00"/>
            <rect x="9" y="9" width="6" height="6" fill="#FFFFFF" rx="1"/>
            <circle cx="12" cy="12" r="2" fill="#FF9800"/>
        </svg>`;
    }
    
    createSeeIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="12" cy="12" rx="9" ry="5" fill="#87CEEB" stroke="#4682B4"/>
            <circle cx="12" cy="12" r="3" fill="#000080" stroke="#191970"/>
            <circle cx="12" cy="12" r="1.5" fill="#000000"/>
            <ellipse cx="10" cy="10" rx="0.8" ry="1.2" fill="#FFFFFF" opacity="0.7"/>
        </svg>`;
    }
    
    createHearIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M3 12 Q6 8, 12 12 Q18 8, 21 12 Q18 16, 12 12 Q6 16, 3 12" fill="#FFB6C1" stroke="#FF69B4"/>
            <circle cx="12" cy="12" r="2" fill="#FF1493" stroke="#DC143C"/>
            <path d="M8 8 Q10 6, 12 8 Q14 6, 16 8" stroke="#FF69B4" stroke-width="2" fill="none"/>
        </svg>`;
    }
    
    createSpeakIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <ellipse cx="8" cy="12" rx="2" ry="6" fill="#F0E68C" stroke="#DAA520"/>
            <path d="M10 8 Q14 8, 18 12 Q14 16, 10 16" fill="#FFE4B5" stroke="#D2B48C"/>
            <path d="M18 9 Q20 10, 20 12 Q20 14, 18 15" stroke="#FF6347" stroke-width="2" fill="none"/>
            <path d="M20 7 Q23 9, 23 12 Q23 15, 20 17" stroke="#FF6347" stroke-width="2" fill="none"/>
        </svg>`;
    }
    
    createEatIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M5 8 L5 20 M7 8 L7 20 M9 6 L9 20 M11 8 L11 20" stroke="#8B4513" stroke-width="2" stroke-linecap="round"/>
            <ellipse cx="18" cy="12" rx="4" ry="8" fill="#F0E68C" stroke="#DAA520"/>
            <circle cx="18" cy="10" r="2" fill="#FFE4B5" stroke="#D2B48C"/>
        </svg>`;
    }
    
    createDrinkIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M8 4 L16 4 L15 20 L9 20 Z" fill="#87CEEB" stroke="#4682B4"/>
            <rect x="9" y="8" width="6" height="8" fill="#ADD8E6" stroke="#87CEEB"/>
            <ellipse cx="12" cy="10" rx="2.5" ry="1" fill="#FFFFFF" opacity="0.5"/>
        </svg>`;
    }
    
    createSleepIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#4169E1" stroke="#191970"/>
            <text x="8" y="8" font-size="2" fill="#FFD700">Z</text>
            <text x="10" y="6" font-size="2.5" fill="#FFD700">Z</text>
            <text x="13" y="4" font-size="3" fill="#FFD700">Z</text>
        </svg>`;
    }
    
    createWorkIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <rect x="4" y="8" width="16" height="12" rx="2" fill="#8B4513" stroke="#654321"/>
            <rect x="6" y="6" width="12" height="2" fill="#A0522D" stroke="#8B4513"/>
            <rect x="9" y="4" width="6" height="2" fill="#D2691E" stroke="#A0522D"/>
            <circle cx="19" cy="14" r="0.8" fill="#FFD700"/>
        </svg>`;
    }
    
    // Weather icons
    createWeatherIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="8" cy="8" r="4" fill="#FFD700" stroke="#FFA500"/>
            <path d="M14 10 Q18 8, 20 12 Q18 16, 14 14 L10 14 Q8 16, 6 14 Q8 12, 10 14" fill="#87CEEB" stroke="#4682B4"/>
            <path d="M6 18 L8 20 M10 18 L12 20 M14 18 L16 20" stroke="#4682B4" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
    }
    
    createSunIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="4" fill="#FFD700" stroke="#FFA500"/>
            <path d="M12 2 L12 4 M12 20 L12 22 M4.22 4.22 L5.64 5.64 M18.36 18.36 L19.78 19.78 M2 12 L4 12 M20 12 L22 12 M4.22 19.78 L5.64 18.36 M18.36 5.64 L19.78 4.22" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
        </svg>`;
    }
    
    createRainIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M6 10 Q10 6, 16 10 Q20 8, 20 12 Q20 16, 16 16 L8 16 Q4 16, 4 12 Q4 8, 6 10" fill="#708090" stroke="#2F4F4F"/>
            <path d="M8 18 L10 22 M12 18 L14 22 M16 18 L18 22" stroke="#4682B4" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
    }
    
    createSnowIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M6 10 Q10 6, 16 10 Q20 8, 20 12 Q20 16, 16 16 L8 16 Q4 16, 4 12 Q4 8, 6 10" fill="#D3D3D3" stroke="#A9A9A9"/>
            <path d="M12 18 L12 22 M9 19 L15 21 M15 19 L9 21" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
            <circle cx="8" cy="19" r="0.5" fill="#FFFFFF"/>
            <circle cx="16" cy="20" r="0.5" fill="#FFFFFF"/>
        </svg>`;
    }
    
    createWindIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M3 8 Q7 6, 11 8 Q15 10, 19 8" stroke="#87CEEB" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M3 12 Q7 10, 11 12 Q15 14, 19 12" stroke="#4682B4" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M3 16 Q7 14, 11 16 Q15 18, 19 16" stroke="#B0C4DE" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`;
    }
    
    // Semantic fallback icons
    createActionIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" fill="#FF9800" stroke="#F57C00"/>
            <path d="M8 12 L12 8 L16 12 L12 16 Z" fill="#FFFFFF" stroke="#FF9800"/>
        </svg>`;
    }
    
    createConceptIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="#9C27B0" stroke="#7B1FA2"/>
            <circle cx="12" cy="12" r="5" fill="none" stroke="#FFFFFF" stroke-width="2"/>
            <circle cx="12" cy="12" r="2" fill="#FFFFFF"/>
        </svg>`;
    }
    
    createPluralIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="8" cy="8" r="3" fill="#4CAF50" stroke="#45A049"/>
            <circle cx="16" cy="8" r="3" fill="#4CAF50" stroke="#45A049"/>
            <circle cx="8" cy="16" r="3" fill="#4CAF50" stroke="#45A049"/>
            <circle cx="16" cy="16" r="3" fill="#4CAF50" stroke="#45A049"/>
        </svg>`;
    }
    
    createColorIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9" fill="url(#rainbow)" stroke="#666666"/>
            <defs>
                <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff0000"/>
                    <stop offset="16.66%" style="stop-color:#ff8c00"/>
                    <stop offset="33.33%" style="stop-color:#ffd700"/>
                    <stop offset="50%" style="stop-color:#00ff00"/>
                    <stop offset="66.66%" style="stop-color:#00bfff"/>
                    <stop offset="83.33%" style="stop-color:#4169e1"/>
                    <stop offset="100%" style="stop-color:#8a2be2"/>
                </linearGradient>
            </defs>
        </svg>`;
    }
}

// Initialize global instance
window.wordSVGIcons = new WordSVGIcons();

console.log('🎨 Enhanced Word-Specific SVG Icons system loaded successfully!');