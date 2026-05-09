import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('hero-section-5-raw.json', 'utf8');
const cleanContent = content.replace(/^\uFEFF/, '');
const data = JSON.parse(cleanContent);

data.files.forEach(file => {
    let targetPath = file.target || file.path;
    // Fix relative paths that go outside project root
    if (targetPath.startsWith('../../')) {
        if (targetPath.includes('logo.tsx')) {
            targetPath = 'components/logo.tsx';
        } else {
            targetPath = targetPath.replace(/^(\.\.\/)+/, '');
        }
    }
    const fullPath = path.join(process.cwd(), targetPath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, file.content);
    console.log(`Created ${targetPath}`);
});
