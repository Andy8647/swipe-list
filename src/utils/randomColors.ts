const materialColors = [
  '#F44336',
  '#FF8A80',
  '#FF5252',
  '#AD1457',
  '#FF4081',
  '#EA80FC',
  '#AB47BC',
  '#7C4DFF',
  '#5E35B1',
  '#3949AB',
  '#283593',
  '#3D5AFE',
  '#1976D2',
  '#2196F3',
  '#2979FF',
  '#00B0FF',
  '#0277BD',
  '#00695C',
  '#00897B',
  '#00BFA5',
  '#00E676',
  '#FF6F00',
  '#F57C00',
  '#FF5722',
  '#607D8B',
];

export function generateRandomColors(len: number): String[] {
  const colors = [];
  for (let i = 0; i < len; i++) {
    colors.push(materialColors[Math.floor(Math.random() * materialColors.length)]);
  }
  return colors;
}
