async function loadTimeline() {
    const container = document.getElementById('timeline-container');

    try {
        const response = await fetch('lul.csv');
        if (!response.ok) throw new Error('Nem sikerült betölteni a CSV fájlt.');
        
        const data = await response.text();
        
        // Split by lines and filter out empty ones
        const rows = data.split(/\r?\n/).filter(row => row.trim() !== '');
        const bodyRows = rows.slice(1); // Skip the header row

        container.innerHTML = ''; 

        bodyRows.forEach((row, index) => {
            // 1. Simple split by semicolon
            const cleanCols = row.split(';').map(col => col.trim());

            // Ensure we have data (expects 9 columns)
            if (cleanCols.length < 9) return;
            
            // CSV Mapping: 
            // 0:event, 1:sY, 2:sM, 3:sD, 4:sS, 5:eY, 6:eM, 7:eD, 8:eS
            const eventText = cleanCols[0];
            const sY = cleanCols[1], sM = cleanCols[2], sD = cleanCols[3], sS = cleanCols[4];
            const eY = cleanCols[5], eM = cleanCols[6], eD = cleanCols[7], eS = cleanCols[8];

            // 2. Helper: Build the "Year. Month. Day. Season." block
            const getFullDateString = (y, m, d, s) => {
                let parts = [];
                const isValid = (val) => val && val.toLowerCase() !== "nan" && val !== "";

                if (isValid(y)) parts.push(`${y}.`);
                if (isValid(m)) parts.push(`${m}.`);
                if (isValid(d)) parts.push(`${d}.`);
                if (isValid(s)) {
                    // Capitalize first letter (e.g., nyár -> Nyár)
                    const capitalizedSeason = s.charAt(0).toUpperCase() + s.slice(1);
                    parts.push(`${capitalizedSeason}.`);
                }
                return parts.join(' '); // Join with a single space
            };

            const startFull = getFullDateString(sY, sM, sD, sS);
            const endFull = getFullDateString(eY, eM, eD, eS);

            // 3. Combine Start and End with a dash
            let finalDisplay = startFull;
            if (endFull && endFull !== startFull) {
                finalDisplay += ` - ${endFull}`;
            }

            // 5. Create and inject the HTML
            const section = document.createElement('section');
            section.innerHTML = `
                <div class="section-title">
                    ${sY !== "nan" ? sY : ''}
                </div>
                <div class="section-content">
                    <article>
                        <aside>
                            <div class="dot"></div>
                            ${index !== bodyRows.length - 1 ? '<div class="line"></div>' : ''}
                        </aside>
                        <main>
                            <div class="timeline-date">${finalDisplay}</div>
                            <div class="timeline-event">${eventText}</div>
                        </main>
                    </article>
                </div>
            `;
            container.appendChild(section);
        });

    } catch (error) {
        console.error('Hiba történt:', error);
        container.innerHTML = `<p style="color: red; padding: 20px;">Hiba történt: ${error.message}</p>`;
    }
}

// Initialize the timeline
loadTimeline();