document.addEventListener("DOMContentLoaded", () => {
    const drugs = [
        { name: "Paracetamol", doseMgPerKg: 15, strengthMgPerMl: 25, frequency: "Q6H", type: "Analgesic" },
        { name: "Cefixime", doseMgPerKg: 10, strengthMgPerMl: 20, frequency: "OD/BD", type: "Antibiotic" },
        { name: "Amoxicillin", doseMgPerKg: 40, strengthMgPerMl: 50, frequency: "BD/TID", type: "Antibiotic" },
        { name: "Azithromycin", doseMgPerKg: 10, strengthMgPerMl: 40, frequency: "OD", type: "Antibiotic" },
        { name: "Cefpodoxime", doseMgPerKg: 10, strengthMgPerMl: 10, frequency: "BD", type: "Antibiotic" },
        { name: "Amox-Clav", doseMgPerKg: 40, strengthMgPerMl: 40, frequency: "BD", type: "Antibiotic" },
        { name: "Ibuprofen", doseMgPerKg: 10, strengthMgPerMl: 20, frequency: "Q6-8H", type: "NSAID" },
        { name: "Metronidazole", doseMgPerKg: 25, strengthMgPerMl: 40, frequency: "TID", type: "Antibiotic" },
        { name: "Cephalexin", doseMgPerKg: 25, strengthMgPerMl: 50, frequency: "QID", type: "Antibiotic" },
        { name: "Chlorpheniramine", doseMgPerKg: 0.35, strengthMgPerMl: 2, frequency: "TID", type: "Antihistamine" },
        { name: "Ondansetron", doseMgPerKg: 0.15, strengthMgPerMl: 2, frequency: "TID", type: "Antiemetic" },
        { name: "Salbutamol", doseMgPerKg: 0.15, strengthMgPerMl: 1, frequency: "TID", type: "Bronchodilator" },
        { name: "Dicyclomine", doseMgPerKg: 1.5, strengthMgPerMl: 5, frequency: "TID", type: "Antispasmodic" },
        { name: "Ranitidine", doseMgPerKg: 2, strengthMgPerMl: 15, frequency: "BD", type: "H2 Blocker" },
        { name: "Zinc", doseMgPerKg: 20, strengthMgPerMl: 10, frequency: "OD (fixed 20 mg/day)", type: "Supplement", isFixed: true }
    ];

    const weightInput = document.getElementById("weight-input");
    const resultsContainer = document.getElementById("results-container");

    // Debounce function for better performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Calculate and display results
    function calculateDoses() {
        const weight = parseFloat(weightInput.value) || 0;
        
        // Clear previous results
        resultsContainer.innerHTML = "";

        if (weight <= 0) {
            showPlaceholder();
            return;
        }

        // Validate weight range
        if (weight > 100) {
            showError("Please verify the weight. Values over 100kg may not be appropriate for pediatric dosing.");
            return;
        }

        // Generate drug cards
        drugs.forEach((drug, index) => {
            setTimeout(() => {
                createDrugCard(drug, weight);
            }, index * 50); // Staggered animation
        });
    }

    function showPlaceholder() {
        resultsContainer.innerHTML = `
            <div class="results-placeholder">
                <div class="placeholder-icon">📊</div>
                <p>Enter a weight above to see medication dosage calculations</p>
            </div>
        `;
    }

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
    }

    function createDrugCard(drug, weight) {
        // Calculate dosage
        const isFixedDose = drug.isFixed || drug.name === "Zinc";
        const doseMg = isFixedDose ? 20 : weight * drug.doseMgPerKg;
        const doseMl = (doseMg / drug.strengthMgPerMl).toFixed(2);

        const card = document.createElement("div");
        card.className = "card loading";
        
        card.innerHTML = `
            <div class="card-header">
                <h2>${drug.name}</h2>
                <span class="drug-type">${drug.type}</span>
            </div>
            
            <div class="card-info">
                <div class="info-row">
                    <span class="info-label">Standard Dose</span>
                    <span class="info-value">${drug.doseMgPerKg} mg/kg</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Syrup Strength</span>
                    <span class="info-value">${drug.strengthMgPerMl} mg/ml</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Frequency</span>
                    <span class="info-value">${drug.frequency}</span>
                </div>
            </div>

            <div class="calculated-dose">
                <div class="dose-label">Calculated Dose for ${weight} kg</div>
                <div class="dose-value">
                    ${doseMl} <span class="dose-unit">ml per dose</span>
                </div>
            </div>
        `;

        resultsContainer.appendChild(card);
        
        // Add accessibility
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `${drug.name} dosage calculation`);
    }

    // Event listeners with debouncing
    const debouncedCalculate = debounce(calculateDoses, 300);
    weightInput.addEventListener("input", debouncedCalculate);

    // Initialize placeholder
    showPlaceholder();

    // Add keyboard support
    weightInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            calculateDoses();
        }
    });

    // Focus management
    weightInput.addEventListener("focus", () => {
        weightInput.select();
    });
});
