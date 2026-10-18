import type { Localized } from '../types';

export interface RolePlayTurn {
  turn_id: number;
  caller: Localized;
  options: {
    id: string;
    text: Localized;
    is_safe: boolean;
    feedback: Localized;
  }[];
}

export const ROLE_PLAY_TURNS: RolePlayTurn[] = [
  {
    turn_id: 1,
    caller: {
      en: "Hello, this is Agent Davis from Sound Credit Union Fraud Prevention. We're seeing an unauthorized transfer of $1,850 right now. Did you authorize this?",
      es: "Hola, habla el agente Davis de Prevención de Fraude de Sound Credit Union. Vemos una transferencia no autorizada de $1,850 en este momento. ¿Usted la autorizó?"
    },
    options: [
      {
        id: '1a',
        text: { en: "No! Please cancel it immediately!", es: "¡No! ¡Por favor cancélela de inmediato!" },
        is_safe: false,
        feedback: {
          en: "Scammers thrive on panic. Staying calm prevents hasty moves.",
          es: "Los estafadores se aprovechan del pánico. Mantener la calma evita errores."
        }
      },
      {
        id: '1b',
        text: { en: "No, but I will hang up and call the number on my Sound debit card.", es: "No, pero voy a colgar y llamar al número de mi tarjeta de Sound." },
        is_safe: true,
        feedback: {
          en: "Spot on! Calling the official number on your card stops phone spoofing dead.",
          es: "¡Excelente! Llamar al número oficial de su tarjeta neutraliza la suplantación telefónica."
        }
      },
      {
        id: '1c',
        text: { en: "What account number is that for?", es: "¿Para qué número de cuenta es eso?" },
        is_safe: false,
        feedback: {
          en: "Scammers often read partial public info to gain trust.",
          es: "Los estafadores suelen leer datos públicos parciales para ganar confianza."
        }
      }
    ]
  },
  {
    turn_id: 2,
    caller: {
      en: "I understand you're alarmed, but don't hang up! If you disconnect, federal regulations require us to freeze all your assets for 30 days.",
      es: "Entiendo su alarma, ¡pero no cuelgue! Si corta la llamada, las normas federales nos obligan a congelar todos sus fondos por 30 días."
    },
    options: [
      {
        id: '2a',
        text: { en: "Okay, I won't hang up. Tell me what I need to do.", es: "Está bien, no cuelgo. Dígame qué tengo que hacer." },
        is_safe: false,
        feedback: {
          en: "High-pressure urgency and fake legal threats are classic deception tactics.",
          es: "La urgencia extrema y las falsas amenazas legales son tácticas clásicas."
        }
      },
      {
        id: '2b',
        text: { en: "Sound Credit Union never threatens to freeze my accounts if I hang up.", es: "Sound Credit Union nunca amenaza con congelar mi cuenta si cuelgo." },
        is_safe: true,
        feedback: {
          en: "Exactly right. Credit unions never punish you for hanging up to verify.",
          es: "Totalmente correcto. Las cooperativas nunca castigan por colgar para verificar."
        }
      },
      {
        id: '2c',
        text: { en: "Can I speak to your supervisor?", es: "¿Puedo hablar con su supervisor?" },
        is_safe: false,
        feedback: {
          en: "Scammers simply pass the phone to another co-conspirator in the room.",
          es: "Los estafadores simplemente pasan la llamada a otro cómplice en la sala."
        }
      }
    ]
  },
  {
    turn_id: 3,
    caller: {
      en: "To protect your remaining funds, I've generated an encrypted Sound Vault safe-account. You must wire $9,800 to it right away to safeguard it.",
      es: "Para proteger sus fondos restantes, generé una cuenta segura cifrada en Sound Vault. Debe transferir $9,800 ahora mismo para resguardarlo."
    },
    options: [
      {
        id: '3a',
        text: { en: "Real banks never ask members to transfer money to 'keep it safe.'", es: "Los bancos reales nunca piden transferir dinero para 'mantenerlo seguro'." },
        is_safe: true,
        feedback: {
          en: "Golden rule! Legitimate financial institutions already hold your money safely.",
          es: "¡Regla de oro! Las instituciones financieras legítimas ya resguardan su dinero."
        }
      },
      {
        id: '3b',
        text: { en: "Give me the routing and account number.", es: "Deme la ruta y número de cuenta." },
        is_safe: false,
        feedback: {
          en: "Once sent by wire or instant P2P, money cannot be reversed easily.",
          es: "Una vez enviado por transferencia o P2P instantáneo, es casi imposible revertirlo."
        }
      },
      {
        id: '3c',
        text: { en: "Can I just move it to my own savings account?", es: "¿Puedo simplemente moverlo a mi propia cuenta de ahorros?" },
        is_safe: false,
        feedback: {
          en: "Good instinct to keep it internal, but best to hang up first.",
          es: "Buen instinto de mantenerlo interno, pero es mejor colgar primero."
        }
      }
    ]
  },
  {
    turn_id: 4,
    caller: {
      en: "This is a confidential investigation. Do not tell your branch teller or family members, or they could face obstruction charges.",
      es: "Esta es una investigación confidencial. No le diga al cajero ni a sus familiares, o podrían enfrentar cargos de obstrucción."
    },
    options: [
      {
        id: '4a',
        text: { en: "I promise I won't tell anyone.", es: "Le prometo que no le diré a nadie." },
        is_safe: false,
        feedback: {
          en: "Demanding secrecy is how scammers isolate you from people who would help.",
          es: "Exigir secreto es cómo los estafadores lo aíslan de quienes podrían ayudarle."
        }
      },
      {
        id: '4b',
        text: { en: "Telling me to keep secrets from my credit union and family proves this is a scam.", es: "Pedirme guardar secretos a mi cooperativa y a mi familia prueba que esto es una estafa." },
        is_safe: true,
        feedback: {
          en: "Bingo! Secrecy from family and branch staff is the #1 red flag.",
          es: "¡Exacto! El secreto ante familiares y el personal de sucursal es la mayor alerta roja."
        }
      },
      {
        id: '4c',
        text: { en: "I'll go to the ATM right now.", es: "Iré al cajero automático ahora mismo." },
        is_safe: false,
        feedback: {
          en: "Never go to an ATM or wire funds while on a suspicious call.",
          es: "Nunca vaya a un cajero ni envíe transferencias durante una llamada sospechosa."
        }
      }
    ]
  }
];

export interface RedFlagHuntData {
  title: Localized;
  scenarioDescription: Localized;
  messageText: Localized;
  targets: {
    id: string;
    textEn: string;
    textEs: string;
    explanation: Localized;
  }[];
}

export const RED_FLAG_HUNT: RedFlagHuntData = {
  title: {
    en: "Red-Flag Hunt: Spot the 4 Hidden Deceptions",
    es: "Cacería de Señales: Encuentra las 4 Trampas Ocultas"
  },
  scenarioDescription: {
    en: "Tap all 4 suspicious red flags hidden inside this urgent SMS message:",
    es: "Toca las 4 señales sospechosas ocultas dentro de este mensaje SMS urgente:"
  },
  messageText: {
    en: "URGENT SOUND ALERT: Your debit card is SUSPENDED due to illegal activity. Click http://sound-verify-secures.example.com within 5 minutes or police will be dispatched. Do not call local branch.",
    es: "ALERTA URGENTE DE SOUND: Su tarjeta de débito está SUSPENDIDA por actividad ilegal. Haga clic en http://sound-verify-secures.example.com en 5 minutos o se enviará a la policía. No llame a la sucursal local."
  },
  targets: [
    {
      id: 'rf-1',
      textEn: "URGENT SOUND ALERT:",
      textEs: "ALERTA URGENTE DE SOUND:",
      explanation: {
        en: "Manufactured panic and all-caps urgency.",
        es: "Pánico fabricado y urgencia en mayúsculas."
      }
    },
    {
      id: 'rf-2',
      textEn: "http://sound-verify-secures.example.com",
      textEs: "http://sound-verify-secures.example.com",
      explanation: {
        en: "Phishing link on an unverified domain instead of official app.",
        es: "Enlace fraudulento en un dominio no verificado en vez de la app oficial."
      }
    },
    {
      id: 'rf-3',
      textEn: "within 5 minutes or police will be dispatched",
      textEs: "en 5 minutos o se enviará a la policía",
      explanation: {
        en: "Artificial deadline and intimidation with law enforcement.",
        es: "Plazo artificial e intimidación policial."
      }
    },
    {
      id: 'rf-4',
      textEn: "Do not call local branch",
      textEs: "No llame a la sucursal local",
      explanation: {
        en: "Isolation tactic to prevent verification with real staff.",
        es: "Táctica de aislamiento para evitar verificar con personal real."
      }
    }
  ]
};

export interface QuizQuestion {
  id: string;
  question: Localized;
  options: {
    text: Localized;
    isCorrect: boolean;
  }[];
  explanation: Localized;
}

export const QUICK_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: {
      en: "Will Sound Credit Union ever ask you to transfer money to a 'safe holding account'?",
      es: "¿Sound Credit Union le pedirá alguna vez transferir dinero a una 'cuenta de retención segura'?"
    },
    options: [
      { text: { en: "Yes, during major fraud investigations", es: "Sí, durante investigaciones de fraude importantes" }, isCorrect: false },
      { text: { en: "Never. Real banks never ask you to move money to keep it safe", es: "Nunca. Los bancos reales nunca piden mover dinero para protegerlo" }, isCorrect: true },
      { text: { en: "Only if you authorize it over the phone", es: "Solo si usted lo autoriza por teléfono" }, isCorrect: false }
    ],
    explanation: {
      en: "Legitimate financial institutions protect money in your existing insured accounts. 'Safe accounts' are always scams.",
      es: "Las entidades legítimas protegen el dinero en sus cuentas aseguradas existentes. Las 'cuentas seguras' son siempre estafas."
    }
  },
  {
    id: 'q2',
    question: {
      en: "If a caller claiming to be Sound Credit Union tells you NOT to hang up or speak to branch staff, what should you do?",
      es: "Si alguien que afirma ser de Sound Credit Union le dice que NO cuelgue ni hable con la sucursal, ¿qué debe hacer?"
    },
    options: [
      { text: { en: "Follow their instructions so you don't get in trouble", es: "Seguir sus instrucciones para no meterse en problemas" }, isCorrect: false },
      { text: { en: "Hang up immediately and call the number on the back of your card", es: "Colgar inmediatamente y llamar al número al dorso de su tarjeta" }, isCorrect: true },
      { text: { en: "Ask them for their employee badge number", es: "Pedirles su número de placa de empleado" }, isCorrect: false }
    ],
    explanation: {
      en: "Badge numbers can be faked. Hanging up and calling the number on your physical debit card guarantees you reach real staff.",
      es: "Los números de placa pueden falsificarse. Colgar y llamar al número de su tarjeta garantiza contactar al personal real."
    }
  },
  {
    id: 'q3',
    question: {
      en: "Why is instant P2P (or wire transfer) risky to send to strangers or unverified contractors?",
      es: "¿Por qué el P2P instantáneo (o transferencia electrónica) es riesgoso con desconocidos o contratistas no verificados?"
    },
    options: [
      { text: { en: "It acts like physical cash and is very difficult to reverse once sent", es: "Funciona como efectivo y es muy difícil de revertir una vez enviado" }, isCorrect: true },
      { text: { en: "It has a mandatory 3-week hold", es: "Tiene una retención obligatoria de 3 semanas" }, isCorrect: false },
      { text: { en: "It charges a 50% convenience tax", es: "Cobra un impuesto de conveniencia del 50%" }, isCorrect: false }
    ],
    explanation: {
      en: "Instant payments clear in seconds and lack chargeback dispute rights typical of credit cards.",
      es: "Los pagos instantáneos se liquidan en segundos y no tienen los derechos de disputa de las tarjetas de crédito."
    }
  },
  {
    id: 'q4',
    question: {
      en: "When an Otterly Safe payment is paused for 30 seconds, where is your money?",
      es: "Cuando un pago de Otterly Safe se pausa por 30 segundos, ¿dónde está su dinero?"
    },
    options: [
      { text: { en: "It has already left your account", es: "Ya salió de su cuenta" }, isCorrect: false },
      { text: { en: "Still safe in your Sound Credit Union account", es: "Aún seguro en su cuenta de Sound Credit Union" }, isCorrect: true },
      { text: { en: "Held in an escrow vault at the Federal Reserve", es: "Retenido en una bóveda de la Reserva Federal" }, isCorrect: false }
    ],
    explanation: {
      en: "Otterly Safe pauses outgoing transfers before the money moves. Your funds never leave your account during a check.",
      es: "Otterly Safe pausa las transferencias salientes antes de que el dinero se mueva. Sus fondos nunca salen de su cuenta durante la revisión."
    }
  },
  {
    id: 'q5',
    question: {
      en: "If you fell victim to an advanced manipulation scam, what is Sound's philosophy?",
      es: "Si fue víctima de una estafa de manipulación avanzada, ¿cuál es la filosofía de Sound?"
    },
    options: [
      { text: { en: "You are solely responsible and no assistance is provided", es: "Usted es el único responsable y no se brinda asistencia" }, isCorrect: false },
      { text: { en: "No-blame recovery: scammers are skilled, and we support you immediately", es: "Recuperación sin culpa: los estafadores son expertos y le apoyamos de inmediato" }, isCorrect: true },
      { text: { en: "Your account is permanently closed", es: "Su cuenta se cancela permanentemente" }, isCorrect: false }
    ],
    explanation: {
      en: "Otterly Safe treats victimized members with kindness, dignity, and active recovery assistance without blame.",
      es: "Otterly Safe trata a los miembros afectados con amabilidad, dignidad y asistencia de recuperación activa sin culpas."
    }
  }
];

export interface OfficialAlert {
  source: string;
  title: Localized;
  summary: Localized;
  date: string;
  referenceUrl: string;
}

export const OFFICIAL_ALERTS: OfficialAlert[] = [
  {
    source: "FTC Consumer Advice (example)",
    title: {
      en: "Scammers Pose as Bank Fraud Departments",
      es: "Estafadores se hacen pasar por Departamentos de Fraude Bancario"
    },
    summary: {
      en: "Criminals send text alerts about fake fraud charges, then call victims claiming their account is breached. They instruct victims to wire money to a 'safe account' or pay with gift cards.",
      es: "Los delincuentes envían alertas de texto sobre cargos fraudulentos falsos y luego llaman a las víctimas afirmando que su cuenta fue vulnerada. Les ordenan transferir dinero a una 'cuenta segura' o pagar con tarjetas de regalo."
    },
    date: "2026-09-15",
    referenceUrl: "https://example.com/alerts/ftc-bank-impersonation"
  },
  {
    source: "Washington State DFI Alert (example)",
    title: {
      en: "Contractor and Real Estate Wire Diversion Scams",
      es: "Estafas de desvío de transferencias de contratistas e inmobiliarias"
    },
    summary: {
      en: "Homeowners paying contractors for major repairs are targeted with spoofed emails and sudden payee payment details before completion.",
      es: "Propietarios que pagan reparaciones mayores son blanco de correos falsificados y cambios repentinos de datos de pago antes de finalizar."
    },
    date: "2026-10-01",
    referenceUrl: "https://example.com/alerts/wa-dfi-wire-diversion"
  }
];
