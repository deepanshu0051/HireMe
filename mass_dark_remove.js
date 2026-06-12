const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
};

const srcPath = 'c:/Users/deepu/OneDrive/Desktop/HireMe/frontend/src';
const files = walk(srcPath);

files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Remove Tailwind dark: variants
    // Regex matches " dark:anything" where anything is not a space, quote, or bracket.
    // Also handle "dark:anything " (leading space) or " dark:anything" (trailing or middle)
    const newContent = content.replace(/\sdark:[^\s"'}]+(?=[\s"'}])/g, '');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Stripped dark: classes from ${file}`);
        content = newContent;
    }

    // 2. Remove ThemeContext/useTheme logic from Settings.jsx and DashboardLayout.jsx
    if (file.includes('Settings.jsx') || file.includes('DashboardLayout.jsx')) {
        // Remove useTheme imports
        content = content.replace(/import \{.*?useTheme.*?\} from ["'].*?ThemeContext["'];?/g, '');
        // Remove useTheme() hook call
        content = content.replace(/const \{.*?isDark.*?toggleTheme.*?\} = useTheme\(\);?/g, '');
        // Remove ThemeProvider/Context usages
        fs.writeFileSync(file, content, 'utf8');
    }
});

// Specific cleanup for Settings.jsx: Remove the Appearance section
const settingsPath = 'c:/Users/deepu/OneDrive/Desktop/HireMe/frontend/src/pages/Settings.jsx';
if (fs.existsSync(settingsPath)) {
    let settingsContent = fs.readFileSync(settingsPath, 'utf8');
    
    // Find SectionCard with title="Appearance" and remove it.
    // The section starts around line 212 and ends around 271.
    // It's inside <SectionCard title="Appearance" ...> ... </SectionCard>
    
    const appearanceRegex = /<SectionCard title="Appearance"[\s\S]*?<\/SectionCard>/;
    if (appearanceRegex.test(settingsContent)) {
        settingsContent = settingsContent.replace(appearanceRegex, '');
        console.log("Removed Appearance section from Settings.jsx");
    }
    
    // Also remove Toggle definition if it's only used for theme (it's used elsewhere for Auto-Send)
    // So we keep Toggle but clean its internal dark: classes (already done by regex)
    
    fs.writeFileSync(settingsPath, settingsContent, 'utf8');
}

console.log("Mass cleanup complete.");
