export interface SampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleItem[] = [
  {
    id: 'essay',
    title: 'Short Persuasive Essay',
    category: 'Academic',
    description: 'A 280-word structured essay on the beauty of mindful writing.',
    text: `Writing with intentionality is one of the most powerful habits a thinker can develop. In our fast-paced modern world, where brief messages and fragmented thoughts dominate our screens, taking time to compose coherent prose demands quiet discipline.

When we write, we are not merely documenting existing ideas; we are actively clarifying what we believe. Sentences force us to connect cause and effect, test hypotheses, and confront ambiguities that comfortably hide inside vague mental impressions. The act of selecting the precise noun or tuning the rhythm of a clause is, at its root, an act of intellectual honesty.

Furthermore, clear writing cultivates empathy. To craft an essay that resonates across distance and background, one must imagine the mind of the reader. How will this paragraph feel to someone encountering these arguments for the first time? Will the narrative build naturally toward its conclusion, or does it leave unanswered questions in its wake?

Ultimately, word counting is not just a constraint or a mechanical metric. It teaches economy of expression. Every word we deliberately choose or deliberately discard sharpens our voice. As the philosopher Blaise Pascal once remarked, writing simply takes more work than writing superfluously, but the clarity it offers is well worth every revision.`
  },
  {
    id: 'social',
    title: 'Social Media Announcement',
    category: 'Social',
    description: 'Optimized for social platforms like Twitter, LinkedIn, and Instagram.',
    text: `✨ Exciting milestone reached today!

We just shipped the refreshed design for our creative workspace, crafted entirely around clarity, focus, and speed.

Key highlights:
• Real-time character & word tracking
• Live readability scoring & grade-level indicators
• Instant case conversion & space formatting
• Zero clutter, lightning fast, and delightful to use

Whether you are preparing an essay, drafting a post, or fine-tuning your next speech, every syllable counts.

Give it a try and let us know what you think! 🌸`
  },
  {
    id: 'speech',
    title: 'Keynote Speech Opening',
    category: 'Speaking',
    description: 'Inspiring presentation passage ideal for testing word cadence and readability.',
    text: `Good morning, everyone.

Look around this room today. Each of us arrived here with a unique perspective, a distinct set of challenges, and an individual vision for what tomorrow might look like. Yet, despite our differences, we are united by a shared curiosity.

Curiosity is the quiet spark behind every meaningful breakthrough in human history. It asks: What if we questioned the conventional assumptions? What if we redesigned the way we communicate, collaborate, and build?

Today, I invite you to leave behind cynicism and embrace bold optimism. The questions we ask today will shape the projects of tomorrow. Let us begin this journey together with open minds and generous hearts.`
  },
  {
    id: 'creative',
    title: 'Creative Fiction Paragraph',
    category: 'Creative',
    description: 'Descriptive creative writing rich with varied sentence structures.',
    text: `The morning mist hovered over the garden like spun silk, catching the earliest blush of pink dawn. Beneath the cedar archway, dewdrops trembled on wild rose petals, sparkling with iridescent warmth before the sun cleared the rooftop. In the quiet conservatory, an old clock ticked with steady reassurance, measuring the calm moments before the bustling world awoke to another autumn day.`
  }
];

export const PLATFORM_LIMITS = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    type: 'characters' as const,
    max: 280,
    description: 'Standard tweet length limit'
  },
  {
    id: 'meta-description',
    name: 'Google Meta Description',
    type: 'characters' as const,
    max: 160,
    recommendedMax: 155,
    description: 'Recommended snippet length in search results'
  },
  {
    id: 'title-tag',
    name: 'SEO Page Title',
    type: 'characters' as const,
    max: 60,
    recommendedMax: 55,
    description: 'Title visible on search result tabs'
  },
  {
    id: 'sms',
    name: 'Standard SMS Message',
    type: 'characters' as const,
    max: 160,
    description: 'Single standard SMS segment limit'
  },
  {
    id: 'instagram',
    name: 'Instagram Caption',
    type: 'characters' as const,
    max: 2200,
    recommendedMax: 125,
    description: 'Max 2,200 chars (first 125 chars visible before "more")'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    type: 'characters' as const,
    max: 3000,
    recommendedMax: 210,
    description: 'Post limit (first 210 chars visible before fold)'
  },
  {
    id: 'pinterest',
    name: 'Pinterest Pin Description',
    type: 'characters' as const,
    max: 500,
    description: 'Standard pin description maximum'
  }
];
