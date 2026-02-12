/**
 * Utility to clean up technical style prompts often mixed into user instruction fields.
 * This is especially useful for legacy data and for ensuring a clean UI presentation.
 */

const STYLE_MARKERS = [
  '--- voice_style_reference ---',
  '--- voice_style_reference_only ---',
  '<voice_style_reference>',
  '<voice_style_reference_only>',
  '**MSG ENDING LOGIC',
  '**ENDING VARIETY',
  '**STYLE_RULES**'
];

/**
 * Strips technical style-related markers and YAML blocks from a string.
 * Returns only the non-technical part of the text.
 */
export function cleanUserInstruction(text: string | undefined | null): string {
  if (!text) return '';

  let lines = text.split('\n');
  let resultLines: string[] = [];
  let inTechnicalBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if line starts a technical block
    if (STYLE_MARKERS.some(marker => trimmed.includes(marker))) {
      inTechnicalBlock = true;
      continue;
    }

    // Heuristic: If we see a YAML-like header or separator inside a suspected block
    if (inTechnicalBlock) {
      // If we see a very long dashed line or typical technical delimiter
      if (trimmed.startsWith('---') || trimmed.startsWith('===')) {
        continue;
      }
      
      // If the line looks like a user instruction (not indented like YAML),
      // we might want to reconsider? But for now, once a block starts, 
      // we assume everything until a break is technical.
      
      // If the line is empty, it might be a break between technical and real instructions
      if (trimmed === '') {
        inTechnicalBlock = false;
        continue;
      }
      
      continue;
    }

    resultLines.push(line);
  }

  return resultLines.join('\n').trim();
}

/**
 * Checks if a prompt string contains actual user input or just technical style markers.
 */
export function hasActualUserInstruction(text: string | undefined | null): boolean {
  return cleanUserInstruction(text).length > 0;
}
