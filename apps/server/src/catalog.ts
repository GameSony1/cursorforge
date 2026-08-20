import { SKIN_SHAPES, type Skin } from '@cursor-customizer/shared';

/**
 * Stand-in for a real skin store (DB + CDN). Kept in-memory for now so the
 * desktop app already talks to it over HTTP exactly like it would to a
 * hosted backend — swapping this for a real database is a drop-in change.
 */
export const SKIN_CATALOG: Skin[] = [
  {
    id: 'star',
    name: 'Звезда',
    description: 'Классическая пятиконечная звезда.',
    category: 'character',
    free: true,
    defaultColor: '#ffd23f',
    shape: SKIN_SHAPES.star
  },
  {
    id: 'shuriken',
    name: 'Сюрикен',
    description: 'Ниндзя-звезда для скрытных игроков.',
    category: 'character',
    free: true,
    defaultColor: '#e0e0e0',
    shape: SKIN_SHAPES.shuriken
  },
  {
    id: 'paw',
    name: 'Лапка',
    description: 'Пушистый спутник оставляет след на экране.',
    category: 'character',
    free: true,
    defaultColor: '#ff8fab',
    shape: SKIN_SHAPES.paw
  },
  {
    id: 'ghost',
    name: 'Призрак',
    description: 'Дружелюбное привидение сопровождает курсор.',
    category: 'character',
    free: false,
    defaultColor: '#c9b6ff',
    shape: SKIN_SHAPES.ghost
  },
  {
    id: 'lightning',
    name: 'Молния',
    description: 'Заряженный болт для быстрых реакций.',
    category: 'theme',
    free: false,
    defaultColor: '#4dd2ff',
    shape: SKIN_SHAPES.lightning
  },
  {
    id: 'gem',
    name: 'Кристалл',
    description: 'Редкий самоцвет из подземелья.',
    category: 'theme',
    free: false,
    defaultColor: '#7fffd4',
    shape: SKIN_SHAPES.gem
  },
  {
    id: 'garlic',
    name: 'Чеснок',
    description: 'Обычная стрелка, но при зажатии кнопки мыши превращается в головку чеснока — на случай встречи с вампирами.',
    category: 'theme',
    free: true,
    defaultColor: '#e8dcb5',
    shape: SKIN_SHAPES.garlicArrow,
    pressedShape: SKIN_SHAPES.garlicBulb,
    pressedColor: '#e8dcb5'
  },
  {
    id: 'splash',
    name: 'Сплэш',
    description: 'Стрелка-клякса с каплями краски, при нажатии складывается в указывающую руку.',
    category: 'theme',
    free: false,
    defaultColor: '#d946ef',
    shape: SKIN_SHAPES.splashArrow,
    pressedShape: SKIN_SHAPES.pointingHand,
    pressedColor: '#d946ef'
  },
  {
    id: 'glossy',
    name: 'Глянец 3D',
    description: 'Объёмная стрелка в стиле стеклянной 3D-иконки, при нажатии — рука.',
    category: 'theme',
    free: false,
    defaultColor: '#8b5cf6',
    shape: SKIN_SHAPES.glossyArrow,
    pressedShape: SKIN_SHAPES.pointingHand,
    pressedColor: '#60a5fa'
  },
  // User-supplied raster art (авторские картинки, а не векторные фигуры).
  {
    id: 'art-striped',
    name: 'Полосатый',
    description: 'Диагональные неоновые полосы — стрелка и рука.',
    category: 'theme',
    free: true,
    image: { idleUrl: '/assets/skins/striped-idle.png', pressedUrl: '/assets/skins/striped-pressed.png' }
  },
  {
    id: 'art-swirl',
    name: 'Вихрь',
    description: 'Абстрактный 3D-вихрь в розово-голубом градиенте.',
    category: 'theme',
    free: false,
    image: { idleUrl: '/assets/skins/swirl-idle.png', pressedUrl: '/assets/skins/swirl-pressed.png' }
  },
  {
    id: 'art-fuzzy',
    name: 'Пушистый',
    description: 'Мягкая пушистая текстура, стрелка и рука.',
    category: 'theme',
    free: false,
    image: { idleUrl: '/assets/skins/fuzzy-idle.png', pressedUrl: '/assets/skins/fuzzy-pressed.png' }
  },
  {
    id: 'art-kawaii',
    name: 'Кавай-перекус',
    description: 'Пакетик сока, а при нажатии — пончик-котик.',
    category: 'character',
    free: false,
    image: { idleUrl: '/assets/skins/kawaii-idle.png', pressedUrl: '/assets/skins/kawaii-pressed.png' }
  },
  {
    id: 'art-shadow-arrow',
    name: 'Тень',
    description: 'Чёрная стрелка с мягкой тенью.',
    category: 'theme',
    free: true,
    image: { idleUrl: '/assets/skins/shadow-arrow-idle.png' }
  },
  {
    id: 'art-glossy-purple',
    name: 'Аметист',
    description: 'Объёмная стеклянная стрелка глубокого фиолетового цвета.',
    category: 'theme',
    free: false,
    image: { idleUrl: '/assets/skins/glossy-purple-idle.png' }
  }
];
