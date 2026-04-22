from pathlib import Path
p = Path(r'C:\Users\杨秋晨\Desktop\anomaly-hub\index.html')
s = p.read_text(encoding='utf-8')
s = s.replace('linear-gradient(rgba(248, 245, 255, 0.18), rgba(255, 240, 245, 0.16))','linear-gradient(rgba(248, 245, 255, 0.08), rgba(255, 240, 245, 0.06))')
s = s.replace('''  body::before {
    width: 300px;
    height: 300px;
    right: -40px;
    top: -30px;
    background: radial-gradient(circle, rgba(255,255,255,0.24) 0%, rgba(242,221,255,0.08) 34%, rgba(242,221,255,0) 74%);
  }
  body::after {
    width: 220px;
    height: 220px;
    right: 120px;
    top: 50px;
    background: radial-gradient(circle, rgba(255,241,247,0.18) 0%, rgba(255,229,241,0.08) 34%, rgba(255,229,241,0) 72%);
  }
''','''  body::before {
    width: 180px;
    height: 180px;
    right: -20px;
    top: -10px;
    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(242,221,255,0.03) 34%, rgba(242,221,255,0) 74%);
  }
  body::after {
    width: 120px;
    height: 120px;
    right: 140px;
    top: 60px;
    background: radial-gradient(circle, rgba(255,241,247,0.08) 0%, rgba(255,229,241,0.03) 34%, rgba(255,229,241,0) 72%);
  }
''')
s = s.replace('''  .main::before {
    content: "";
    position: absolute;
    width: 220px;
    height: 220px;
    right: -80px;
    top: -70px;
    background: radial-gradient(circle, rgba(244, 229, 255, 0.18) 0%, rgba(244, 229, 255, 0.08) 34%, rgba(244, 229, 255, 0) 72%);
    pointer-events: none;
  }
  .main::after {
    content: none;
  }
''','''  .main::before {
    content: none;
  }
  .main::after {
    content: none;
  }
''')
s = s.replace("const MENU_ITEMS = [\n  { id: 'home', emoji: '🏠', label: '首页' },\n  { id: 'anomaly', emoji: '🔗', label: '偏差链' },\n  { id: 'romanring', emoji: '💍', label: '如慕令' },\n  { id: 'collection', emoji: '⭐', label: '收藏' },\n];\n", "const MENU_ITEMS = [\n  { id: 'home', icon: 'home', label: '首页' },\n  { id: 'anomaly', icon: 'sparkles', label: '偏差链' },\n  { id: 'romanring', icon: 'gem', label: '如慕令' },\n  { id: 'collection', icon: 'star', label: '收藏' },\n];\n\nfunction MenuIcon({ type }) {\n  const commonProps = {\n    viewBox: '0 0 24 24',\n    width: '18',\n    height: '18',\n    fill: 'none',\n    stroke: 'currentColor',\n    strokeWidth: '1.8',\n    strokeLinecap: 'round',\n    strokeLinejoin: 'round',\n  };\n\n  if (type === 'home') {\n    return (\n      <svg {...commonProps}>\n        <path d=\"M3 10.5 12 3l9 7.5\" />\n        <path d=\"M6 9.5V20h12V9.5\" />\n      </svg>\n    );\n  }\n\n  if (type === 'sparkles') {\n    return (\n      <svg {...commonProps}>\n        <path d=\"M12 4l1.9 5.1L19 11l-5.1 1.9L12 18l-1.9-5.1L5 11l5.1-1.9L12 4Z\" />\n        <path d=\"M18 4v2.5\" />\n        <path d=\"M19.25 5.25h-2.5\" />\n      </svg>\n    );\n  }\n\n  if (type === 'gem') {\n    return (\n      <svg {...commonProps}>\n        <path d=\"M7 7 10 4h4l3 3-5 13L7 7Z\" />\n        <path d=\"M10 4l2 3 2-3\" />\n        <path d=\"M7 7h10\" />\n      </svg>\n    );\n  }\n\n  return (\n    <svg {...commonProps}>\n      <path d=\"m12 3 2.7 5.5 6.1.9-4.4 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.2 6.1-.9L12 3Z\" />\n    </svg>\n  );\n}\n")
s = s.replace('<span className="menu-emoji">{item.emoji}</span>', '<span className="menu-emoji"><MenuIcon type={item.icon} /></span>')
p.write_text(s, encoding='utf-8')
print('ok')
