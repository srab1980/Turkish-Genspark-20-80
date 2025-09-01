// 🎨 Word SVG Icons System
// Generates contextual SVG icons based on word content and category

class WordSVGIcons {
    constructor() {
        this.iconCache = new Map();
        console.log('🎨 Word SVG Icons system initialized');
    }
    
    /**
     * Get SVG icon for a word based on its Turkish content and category
     */
    getIconForWord(word) {
        const cacheKey = `${word.turkish}_${word.id}`;
        
        if (this.iconCache.has(cacheKey)) {
            return this.iconCache.get(cacheKey);
        }
        
        let svg = null;
        const turkishWord = word.turkish.toLowerCase();
        
        // Category-based icons first, then specific word matches
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
        
        // Fallback to generic category icon
        if (!svg) {
            svg = this.getGenericCategoryIcon(word.id);
        }
        
        this.iconCache.set(cacheKey, svg);
        return svg;
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
    
    // Additional missing methods
    createGoodbyeWaveIcon() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="none" stroke="#3498DB" stroke-width="2"/>
            <polyline points="16,17 21,12 16,7" fill="none" stroke="#3498DB" stroke-width="2"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="#3498DB" stroke-width="2"/>
            <path d="M7 8 Q9 6, 11 8 Q13 10, 11 12 Q9 10, 7 8" fill="#F39C12" stroke="#E67E22"/>
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
}

// Initialize global instance
window.wordSVGIcons = new WordSVGIcons();

console.log('🎨 Word SVG Icons system loaded successfully!');