import { z } from 'zod';

export const ChatbotTutorInputSchema = z.object({
  query: z.string().describe('La consulta del usuario sobre vocabulario o gramática de lenguaje de señas.'),
});

export type ChatbotTutorInput = z.infer<typeof ChatbotTutorInputSchema>;

export const ChatbotTutorOutputSchema = z.object({
  answer: z.string().describe('La respuesta a la consulta del usuario sobre lenguaje de señas.'),
});

export type ChatbotTutorOutput = z.infer<typeof ChatbotTutorOutputSchema>;

export async function chatbotTutor(input: ChatbotTutorInput): Promise<ChatbotTutorOutput> {
  const q = input.query.trim();
  const qNorm = q.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  // Conocimiento mínimo incorporado
  const dictionary: Record<string, string> = {
    'hola':
      '- Extiende la mano abierta a la altura de la frente y haz un pequeño gesto hacia afuera.\n- Variante: un leve movimiento lateral de la mano abierta frente al rostro.',
    'gracias':
      '- Coloca la punta de los dedos en el mentón y mueve la mano hacia adelante (como soplando un beso, pero desde el mentón).',
    'por favor':
      '- Mano abierta sobre el pecho haciendo un movimiento circular.',
    'adios':
      '- Mano abierta moviendo los dedos (saludo de despedida) o pequeño vaivén de la mano.',
    'si':
      '- Cierra la mano en puño y asiente con ella, como si fuera una cabeza diciendo "sí".',
    'no':
      '- Junta índice y medio con el pulgar (como un pico) y ábrelos/ciérralos una vez.'
  };

  // Intent: "como se dice X en lenguaje de senas" (usar texto normalizado sin tildes)
  const comoSeDice = /(como\s+se\s+(?:dice|signa))\s+(?:la\s+sena\s+de\s+)?(.+?)(?:\s+en\s+lengua(?:je)?\s+de\s+senas\b.*)?(?:\s+dime.*)?$/i;
  // Alternativa: "explicame la sena de X"
  const explicame = /(explicame|explicate|expl\u00edcame)\s+(?:la\s+sena\s+de\s+)?(.+)$/i;

  let rawTerm: string | null = null;
  const m1 = qNorm.match(comoSeDice);
  if (m1) {
    rawTerm = m1[2];
  } else {
    const m2 = qNorm.match(explicame);
    if (m2) rawTerm = m2[2];
  }

  if (rawTerm) {
    const term = rawTerm
      .replace(/^["'\[{(\s]+/, '')
      .replace(/["'\]})\s.,;:!?]+$/g, '')
      .trim();
    const termKey = term.toLowerCase();
    const known = dictionary[termKey];
    if (known) {
      return {
        answer: `Así se dice "${term}" en lengua de señas:\n\n${known}\n\nConsejo: practica esta seña en la sección Practicar. Puedes ir a: /practice?sign=${term}`,
      };
    }
    return {
      answer: `No tengo una descripción guardada para "${term}".\n\nSugerencias:\n- Busca la seña en la sección Aprender (/learn).\n- Practica con: /practice?sign=${term}.\n- Si quieres, dime otra palabra y te explico la seña si la conozco.`,
    };
  }

  // Respuestas rápidas
  for (const key of Object.keys(dictionary)) {
    if (qNorm.includes(key)) {
      return {
        answer: `Sobre "${key}":\n\n${dictionary[key]}\n\n¿Quieres que abramos práctica para esta seña? Usa /practice?sign=${key}`,
      };
    }
  }

  // Fallback adicional: si incluye "como se dice" y alguna palabra del diccionario
  if (/como\s+se\s+(?:dice|signa)/i.test(qNorm)) {
    const hit = Object.keys(dictionary).find(k => qNorm.includes(k));
    if (hit) {
      return {
        answer: `Así se dice "${hit}" en lengua de señas:\n\n${dictionary[hit]}\n\nPuedes practicar en: /practice?sign=${hit}`,
      };
    }
  }

  // Mensaje por defecto (orientación)
  return {
    answer:
      'Puedo ayudarte con dudas de vocabulario o gramática en lengua de señas.\n\nEjemplos:\n- "¿Cómo se dice hola en lenguaje de señas?"\n- "Explícame la seña de gracias"\n\nTambién puedes explorar lecciones en /learn o practicar en /practice.',
  };
}
