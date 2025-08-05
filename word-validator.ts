// Comprehensive 5-letter word dictionary for validation
export const VALID_WORDS = new Set([
  // Common 5-letter words
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
  'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
  'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD',
  'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW',
  'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLIND', 'BLOCK', 'BLOOD',
  'BOARD', 'BOAST', 'BOBBY', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRASS', 'BRAVE',
  'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT',
  'BUYER', 'CABLE', 'CACHE', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM',
  'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHESS', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE',
  'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD',
  'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM',
  'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED',
  'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA',
  'DRANK', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DRUNK', 'DRY', 'DADDY',
  'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY',
  'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT',
  'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET',
  'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK',
  'FRAUD', 'FRESH', 'FRONT', 'FROST', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY',
  'HARRY', 'HEART', 'HEAVY', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'HURRY', 'IMAGE',
  'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNIFE',
  'KNOCK', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE',
  'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL',
  'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA',
  'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED',
  'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE',
  'MUSIC', 'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE',
  'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER',
  'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH',
  'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE',
  'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK',
  'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM',
  'REBEL', 'REFER', 'RELAX', 'REPLY', 'RIGHT', 'RIGID', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER',
  'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE',
  'SENSE', 'SERVE', 'SETUP', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF',
  'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIDED', 'SIGHT',
  'SILLY', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART',
  'SMILE', 'SMITH', 'SMOKE', 'SNAKE', 'SNOW', 'SOAPY', 'SOLID', 'SOLVE', 'SORRY', 'SOUND',
  'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT',
  'SQUAD', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL', 'STEEP',
  'STEER', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP',
  'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'SWIFT', 'SWING',
  'SWORN', 'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TERRY', 'TEXAS', 'THANK', 'THEFT',
  'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
  'THREW', 'THROW', 'THUMB', 'TIGHT', 'TIRED', 'TITLE', 'TODAY', 'TOPIC', 'TOTAL', 'TOUCH',
  'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK',
  'TRIED', 'TRIES', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'TWIST', 'TYPED', 'UNCLE',
  'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL',
  'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE', 'WATCH',
  'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WIDOW', 'WIDTH',
  'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WRITE', 'WRONG',
  'WROTE', 'YEARS', 'YOUNG', 'YOURS', 'YOUTH',
  
  // Additional common words
  'ACTED', 'ACTION', 'ACUTE', 'ADMIN', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGENT', 'AGREE',
  'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE',
  'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'ANKLE', 'APART', 'APPLE', 'APPLY',
  'ARENA', 'ARGUE', 'ARISE', 'ARMED', 'ARMOR', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AVOID',
  'AWAKE', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BANKS', 'BASIC', 'BATCH', 'BEACH', 'BEANS',
  'BEARS', 'BEAST', 'BEGAN', 'BEGIN', 'BEING', 'BELLY', 'BELOW', 'BENCH', 'BIKES', 'BILLS',
  'BILLY', 'BIRDS', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEED', 'BLESS',
  'BLIND', 'BLOCK', 'BLOOD', 'BLOOM', 'BLOWN', 'BLUES', 'BLUNT', 'BLUSH', 'BOARD', 'BOAST',
  'BOATS', 'BOBBY', 'BONES', 'BOOKS', 'BOOST', 'BOOTH', 'BOOTS', 'BOUND', 'BOXES', 'BRAIN',
  'BRAKE', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIDE', 'BRIEF',
  'BRING', 'BRINK', 'BROAD', 'BROKE', 'BROOK', 'BROWN', 'BRUSH', 'BUILD', 'BUILT', 'BUNCH',
  'BUNNY', 'BURNS', 'BURST', 'BUSES', 'BUYER', 'CABIN', 'CABLE', 'CACHE', 'CALLS', 'CAMEL',
  'CAMPS', 'CANDY', 'CARDS', 'CARGO', 'CARRY', 'CARVE', 'CASES', 'CATCH', 'CAUSE', 'CAVES',
  'CEASE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHEAT', 'CHECK',
  'CHESS', 'CHEST', 'CHICK', 'CHIEF', 'CHILD', 'CHINA', 'CHIPS', 'CHOSE', 'CIVIL', 'CLAIM',
  'CLAMP', 'CLASH', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLOCK',
  'CLOSE', 'CLOTH', 'CLOUD', 'CLUBS', 'CLUES', 'COACH', 'COALS', 'COAST', 'COATS', 'CODES',
  'COINS', 'CORAL', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRANE', 'CRASH',
  'CRAZY', 'CREAM', 'CREEP', 'CREWS', 'CRIME', 'CRISP', 'CROPS', 'CROSS', 'CROWD', 'CROWN',
  'CRUDE', 'CRUEL', 'CRUSH', 'CURVE', 'CYCLE', 'DAILY', 'DAIRY', 'DANCE', 'DATED', 'DEALT',
  'DEATH', 'DEBUT', 'DECK', 'DECOR', 'DELAY', 'DELTA', 'DENSE', 'DEPTH', 'DESK', 'DEVIL',
  'DIARY', 'DICE', 'DIGIT', 'DIRTY', 'DISCO', 'DIVER', 'DOING', 'DOORS', 'DOUBT', 'DOZEN',
  'DRAFT', 'DRAIN', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE',
  'DROVE', 'DRUGS', 'DRUMS', 'DRUNK', 'DRIED', 'EAGER', 'EAGLE', 'EARLY', 'EARTH', 'EATEN',
  'EIGHT', 'ELDER', 'ELECT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL',
  'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXILE', 'EXIST', 'EXTRA', 'FABLE', 'FACED', 'FACTS',
  'FADED', 'FAILS', 'FAIRY', 'FAITH', 'FALSE', 'FANCY', 'FARMS', 'FATAL', 'FAULT', 'FAVOR',
  'FEARS', 'FEAST', 'FEEDS', 'FEELS', 'FEVER', 'FIBER', 'FIELD', 'FIERY', 'FIFTH', 'FIFTY',
  'FIGHT', 'FILED', 'FILLS', 'FILMS', 'FINAL', 'FINDS', 'FINED', 'FIRES', 'FIRMS', 'FIRST',
  'FIXED', 'FLAGS', 'FLAME', 'FLASH', 'FLEET', 'FLESH', 'FLIES', 'FLOAT', 'FLOCK', 'FLOOD',
  'FLOOR', 'FLOUR', 'FLOWS', 'FLUID', 'FLUSH', 'FLIES', 'FOCAL', 'FOCUS', 'FOLKS', 'FONTS',
  'FOODS', 'FORCE', 'FORMS', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD',
  'FRESH', 'FRIED', 'FRONT', 'FROST', 'FRUIT', 'FUEL', 'FULLY', 'FUNDS', 'FUNNY', 'GAMES',
  'GANGS', 'GATES', 'GEARS', 'GENRE', 'GIFTS', 'GIRLS', 'GIVEN', 'GIVES', 'GLAD', 'GLASS',
  'GLOBE', 'GLORY', 'GLOVE', 'GOALS', 'GOATS', 'GOING', 'GOODS', 'GRACE', 'GRADE', 'GRAIN',
  'GRAND', 'GRANT', 'GRAPE', 'GRAPH', 'GRASP', 'GRASS', 'GRAVE', 'GREAT', 'GREEK', 'GREEN',
  'GREET', 'GRIEF', 'GRILL', 'GRIND', 'GRIPS', 'GROSS', 'GROUP', 'GROWN', 'GROWS', 'GUARD',
  'GUESS', 'GUEST', 'GUIDE', 'GUILD', 'GUILT', 'HABIT', 'HANDS', 'HANDY', 'HAPPY', 'HARSH',
  'HASTE', 'HATED', 'HEADS', 'HEALS', 'HEARD', 'HEART', 'HEAVY', 'HEDGE', 'HEELS', 'HELPS',
  'HERBS', 'HIDES', 'HILLS', 'HINTS', 'HIRES', 'HOLDS', 'HOLES', 'HOLLY', 'HOMES', 'HONEY',
  'HOOKS', 'HOPES', 'HORNS', 'HORSE', 'HOSTS', 'HOTEL', 'HOURS', 'HOUSE', 'HOVER', 'HUGE',
  'HUMAN', 'HUMOR', 'HURRY', 'HURTS', 'IDEAL', 'IDEAS', 'IMAGE', 'IMPLY', 'INDEX', 'INDIE',
  'INNER', 'INPUT', 'INSECT', 'INTRO', 'IONIC', 'IRISH', 'IRONS', 'ISSUE', 'ITEMS', 'IVORY',
  'JAPAN', 'JEANS', 'JEWEL', 'JIMMY', 'JOINS', 'JOINT', 'JOKES', 'JONES', 'JUDAS', 'JUDGE',
  'JUICE', 'JUMBO', 'JUMPS', 'KEEPS', 'KILLS', 'KINDS', 'KINGS', 'KNIFE', 'KNOCK', 'KNOTS',
  'KNOWN', 'KNOWS', 'LABEL', 'LABOR', 'LACKS', 'LAKES', 'LAMPS', 'LANDS', 'LANES', 'LARGE',
  'LASER', 'LASTS', 'LATER', 'LAUGH', 'LAVA', 'LAYER', 'LEADS', 'LEARN', 'LEASE', 'LEAST',
  'LEAVE', 'LEDGE', 'LEGAL', 'LEMON', 'LEVEL', 'LEWIS', 'LIFTS', 'LIGHT', 'LIKED', 'LIKES',
  'LIMIT', 'LINED', 'LINES', 'LINKS', 'LIONS', 'LISTS', 'LIVED', 'LIVER', 'LIVES', 'LOANS',
  'LOBBY', 'LOCAL', 'LOCKS', 'LODGE', 'LOGIC', 'LOOKS', 'LOOPS', 'LOOSE', 'LORDS', 'LOSES',
  'LOVED', 'LOVER', 'LOVES', 'LOWER', 'LOYAL', 'LUCKY', 'LUNCH', 'LUNGS', 'LYING', 'LYRIC',
  'MAGIC', 'MAILS', 'MAJOR', 'MAKER', 'MAKES', 'MALES', 'MALLS', 'MANGA', 'MAPLE', 'MARCH',
  'MARIA', 'MARKS', 'MARRY', 'MATCH', 'MATES', 'MAYBE', 'MAYOR', 'MEALS', 'MEANS', 'MEANT',
  'MEATS', 'MEDAL', 'MEDIA', 'MEETS', 'MELON', 'MELTS', 'MEMOS', 'MENUS', 'MERCY', 'MERGE',
  'MERIT', 'MERRY', 'METAL', 'METER', 'MICRO', 'MIGHT', 'MILES', 'MILLS', 'MINDS', 'MINES',
  'MINOR', 'MINUS', 'MIXED', 'MIXES', 'MODEL', 'MODES', 'MONEY', 'MONTH', 'MOODS', 'MORAL',
  'MOTOR', 'MOULD', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVES', 'MOVIE', 'MUSIC', 'MYTHS',
  'NAILS', 'NAKED', 'NAMED', 'NAMES', 'NASTY', 'NAVAL', 'NEEDS', 'NERVE', 'NEVER', 'NEWLY',
  'NEWS', 'NIGHT', 'NINTH', 'NOBLE', 'NODES', 'NOISE', 'NORMS', 'NORTH', 'NOTED', 'NOTES',
  'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'OLDER', 'OLIVE', 'OPENS', 'OPERA',
  'ORDER', 'ORGAN', 'OTHER', 'OUGHT', 'OUTER', 'OWNED', 'OWNER', 'PACED', 'PAGES', 'PAINT',
  'PAIRS', 'PALE', 'PANEL', 'PANIC', 'PAPER', 'PARKS', 'PARTS', 'PARTY', 'PASTA', 'PASTE',
  'PATCH', 'PATHS', 'PAUSE', 'PEACE', 'PEAKS', 'PEARL', 'PENNY', 'PETER', 'PHASE', 'PHONE',
  'PHOTO', 'PIANO', 'PICKS', 'PIECE', 'PILES', 'PILOT', 'PIPES', 'PITCH', 'PIZZA', 'PLACE',
  'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'PLAYS', 'PLAZA', 'PLOTS', 'POEMS', 'POETS', 'POINT',
  'POKER', 'POLES', 'POOLS', 'PORCH', 'POSES', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE',
  'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROPS', 'PROUD', 'PROVE', 'PULLS', 'PULSE',
  'PUMPS', 'PUNCH', 'PUPIL', 'PURSE', 'QUEEN', 'QUERY', 'QUEST', 'QUICK', 'QUIET', 'QUITE',
  'QUOTE', 'RACES', 'RADIO', 'RAILS', 'RAINS', 'RAISE', 'RANKS', 'RAPID', 'RATES', 'RATIO',
  'REACH', 'READS', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'RELAY', 'REMIX', 'REPLY',
  'RESET', 'RIGHT', 'RIGID', 'RINGS', 'RISES', 'RISKS', 'RIVAL', 'RIVER', 'ROADS', 'ROAST',
  'ROBES', 'ROBIN', 'ROBOT', 'ROCKS', 'ROGER', 'ROLES', 'ROLLS', 'ROMAN', 'ROOMS', 'ROOTS',
  'ROSES', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RUGBY', 'RUINS', 'RULES', 'RURAL', 'SADLY',
  'SAFER', 'SALES', 'SALON', 'SANDY', 'SAUCE', 'SAVED', 'SAVES', 'SCALE', 'SCARE', 'SCENE',
  'SCOPE', 'SCORE', 'SCOTS', 'SEALS', 'SEATS', 'SEEDS', 'SEEKS', 'SEEMS', 'SELLS', 'SENSE',
  'SERVE', 'SETUP', 'SEVEN', 'SHADE', 'SHAKE', 'SHALL', 'SHAME', 'SHAPE', 'SHARE', 'SHARK',
  'SHARP', 'SHEEP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIPS', 'SHIRT', 'SHOCK',
  'SHOES', 'SHOOT', 'SHOPS', 'SHORT', 'SHOWN', 'SHOWS', 'SIDES', 'SIGHT', 'SIGNS', 'SILLY',
  'SILVER', 'SINCE', 'SINGS', 'SITES', 'SIXTH', 'SIXTY', 'SIZED', 'SIZES', 'SKILL', 'SKINS',
  'SKULL', 'SLEEP', 'SLICE', 'SLIDE', 'SLIM', 'SLOPE', 'SMALL', 'SMART', 'SMELL', 'SMILE',
  'SMITH', 'SMOKE', 'SNAKE', 'SNACK', 'SNAPS', 'SNEAK', 'SNOOP', 'SNOWY', 'SOAPY', 'SOCKS',
  'SOFAS', 'SOLAR', 'SOLID', 'SOLVE', 'SONGS', 'SONIC', 'SORRY', 'SORTS', 'SOULS', 'SOUND',
  'SOUPS', 'SOUTH', 'SPACE', 'SPARE', 'SPARK', 'SPEAK', 'SPEED', 'SPELL', 'SPEND', 'SPENT',
  'SPICE', 'SPINE', 'SPITE', 'SPLIT', 'SPOKE', 'SPORT', 'SPOTS', 'SPRAY', 'SQUAD', 'STAFF',
  'STAGE', 'STAKE', 'STAMP', 'STAND', 'STARS', 'START', 'STATE', 'STAYS', 'STEAM', 'STEEL',
  'STEEP', 'STEER', 'STEMS', 'STEPS', 'STICK', 'STILL', 'STING', 'STOCK', 'STONE', 'STOOD',
  'STOOLS', 'STOPS', 'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE',
  'SUGAR', 'SUITE', 'SUITS', 'SUPER', 'SWEAR', 'SWEAT', 'SWEET', 'SWEPT', 'SWIFT', 'SWING',
  'SWISS', 'SWORD', 'SWORN', 'TABLE', 'TAKES', 'TALES', 'TALKS', 'TANKS', 'TAPES', 'TASKS',
  'TASTE', 'TAXES', 'TEACH', 'TEAMS', 'TEARS', 'TEENS', 'TEETH', 'TELLS', 'TENTH', 'TERMS',
  'TERRY', 'TESTS', 'TEXAS', 'TEXTS', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE',
  'THICK', 'THIEF', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB',
  'TIDAL', 'TIGER', 'TIGHT', 'TILED', 'TILES', 'TIMER', 'TIMES', 'TIRED', 'TITLE', 'TODAY',
  'TOKEN', 'TOOLS', 'TOOTH', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOURS', 'TOWER', 'TOWNS',
  'TOXIC', 'TRACK', 'TRADE', 'TRAIL', 'TRAIN', 'TRAIT', 'TRASH', 'TREAT', 'TREND', 'TRIAL',
  'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRIPS', 'TRULY', 'TRUMP', 'TRUNK', 'TRUST', 'TRUTH',
  'TUBES', 'TUNED', 'TURNS', 'TWEET', 'TWICE', 'TWINS', 'TWIST', 'TYPED', 'TYPES', 'UNCLE',
  'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'URGED', 'USAGE',
  'USERS', 'USING', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIEWS', 'VINYL', 'VIRAL', 'VIRUS',
  'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'VOTED', 'VOTES', 'WAGES', 'WAIST', 'WAITS', 'WAKES',
  'WALKS', 'WALLS', 'WANTS', 'WARMS', 'WARNS', 'WASTE', 'WATCH', 'WATER', 'WAVES', 'WEARY',
  'WEIRD', 'WELLS', 'WELSH', 'WHATS', 'WHEAT', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHIPS',
  'WHITE', 'WHOLE', 'WHOSE', 'WIDER', 'WIDOW', 'WIDTH', 'WILDE', 'WINDS', 'WINES', 'WINGS',
  'WIPES', 'WIRED', 'WIRES', 'WITCH', 'WIVES', 'WOMAN', 'WOMEN', 'WOODS', 'WORDS', 'WORKS',
  'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRIST', 'WRITE', 'WRONG',
  'WROTE', 'YARDS', 'YEARS', 'YEAST', 'YIELD', 'YOUNG', 'YOURS', 'YOUTH', 'ZONES'
]);

// Additional validation for word structure
export function isValidWord(word: string): boolean {
  // Convert to uppercase for consistency
  const upperWord = word.toUpperCase();
  
  // Check if word is exactly 5 letters
  if (upperWord.length !== 5) {
    return false;
  }
  
  // Check if word contains only letters
  if (!/^[A-Z]+$/.test(upperWord)) {
    return false;
  }
  
  // Check against dictionary
  return VALID_WORDS.has(upperWord);
}

// Get word validity with detailed feedback
export function validateWordWithFeedback(word: string): { valid: boolean; message?: string } {
  const upperWord = word.toUpperCase();
  
  if (upperWord.length !== 5) {
    return { valid: false, message: "Word must be exactly 5 letters long" };
  }
  
  if (!/^[A-Z]+$/.test(upperWord)) {
    return { valid: false, message: "Word must contain only letters" };
  }
  
  if (!VALID_WORDS.has(upperWord)) {
    return { valid: false, message: "Word not found in dictionary" };
  }
  
  return { valid: true };
}

// Get a random valid word (useful for AI or testing)
export function getRandomValidWord(): string {
  const words = Array.from(VALID_WORDS);
  return words[Math.floor(Math.random() * words.length)];
}

// Check if a word contains specific letters (for game logic)
export function wordContainsLetters(word: string, letters: string[]): boolean {
  const upperWord = word.toUpperCase();
  const upperLetters = letters.map(l => l.toUpperCase());
  
  return upperLetters.some(letter => upperWord.includes(letter));
}