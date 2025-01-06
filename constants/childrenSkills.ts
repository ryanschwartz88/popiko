export type Skill = {
    name: string;
    description: string;
    index: number;
};

export type Unit = {
    title: string;
    skills: Skill[];
};

export type Section = {
    title: string;
    units: Unit[];
};

export const sections: Section[] = [
    {
    title: 'Water Safety',
    units: [
        {
        title: 'Water Confidence',
        skills: [
            { name: 'Enter and Exit the pool safely', description: 'Learn to enter and exit the pool safely.', index: 1 },
            { name: 'Bubbles with Mouth', description: 'Blow bubbles using your mouth in the water.', index: 2 },
            { name: 'Bubbles with Nose', description: 'Blow bubbles using your nose in the water.', index: 3 },
            { name: 'Bobbing', description: 'Practice full submersion in water.', index: 4 },
            { name: 'Rings', description: 'Grab rings underwater (on and off stairs).', index: 5 },
        ],
        },
        {
        title: 'Floating',
        skills: [
            { name: 'Starfish Float (Back)', description: 'Learn to float on your back like a starfish.', index: 6 },
            { name: 'Starfish Float (Front)', description: 'Learn to float on your front like a starfish.', index: 7 },
            { name: 'Tuck Float', description: 'Practice floating in a tuck position.', index: 8 },
        ],
        },
        {
        title: 'Kicking',
        skills: [
            { name: 'Flutter Kick with Kickboard', description: 'Kick 5 yards with a kickboard (head up, then down).', index: 9 },
            { name: 'Flutter Kick on Front and Back', description: 'Kick 5 yards on front and back (Figure 11, Streamline).', index: 10 },
        ],
        },
    ],
    },
    {
    title: 'Freestyle',
    units: [
        {
        title: 'Strokes',
        skills: [
            { name: 'Bent Elbow', description: 'Learn proper elbow bending to prevent straight-arm recovery.', index: 11 },
            { name: 'Shoulder-Width Hand Placement', description: 'Focus on hand placement to prevent hand crossover.', index: 12 },
            { name: 'Full Pull', description: 'Ensure full freestyle pull extending behind.', index: 13 },
        ],
        },
        {
        title: 'Kicking',
        skills: [
            { name: 'Straight Legs', description: 'Maintain straight legs to avoid bicycle kicks.', index: 14 },
            { name: 'Fast Small Kicks', description: 'Keep kicks fast and small to avoid big slow kicks.', index: 15 },
        ],
        },
        {
        title: 'Breathing',
        skills: [
            { name: 'Side Kick with Kickboard', description: 'Practice side kicking with and without a kickboard.', index: 16 },
            { name: 'Switch Drill with Side Breathing', description: 'Perform switch drills with side breathing over 10-15 yards.', index: 17 },
            { name: 'Side Breathing', description: 'Practice side breathing over 10-15 yards.', index: 18 },
        ],
        },
        {
        title: 'Overall',
        skills: [
            { name: 'Freestyle Laps', description: 'Complete 2 laps (40-50 yards) of freestyle non-stop.', index: 19 },
        ],
        },
    ],
    },
    {
        title: 'Backstroke',
        units: [
        {
            title: 'Introductory',
            skills: [
            { name: 'Flutter Kick on Back', description: 'Kick 10 yards on your back (Figure 11 -> Streamline).', index: 20 },
            { name: 'Flat Head Position', description: 'Maintain a flat head position with eyes to the sky to prevent sinking legs.', index: 21 },
            { name: 'Blow Out with Nose', description: 'Blow out with your nose to prevent water entry.', index: 22 },
            ],
        },
        {
            title: 'Strokes',
            skills: [
            { name: 'Y Position', description: 'Prevent straight-back arm strokes with proper arm positioning.', index: 23 },
            { name: 'Alternating Arm Pull and Recovery', description: 'Learn alternating arm pull and recovery on the backside.', index: 24 },
            ],
        },
        {
            title: 'Kicking',
            skills: [
            { name: 'Straight Legs', description: 'Maintain straight legs to avoid bicycle kicks.', index: 25 },
            { name: 'Fast Small Kicks', description: 'Perform fast, small kicks to improve efficiency.', index: 26 },
            ],
        },
        ],
    },
    {
        title: 'Breaststroke',
        units: [
        {
            title: 'Introductory',
            skills: [
            { name: 'Wall Push Off', description: 'Hold a glide in Figure 11 position for 4 seconds.', index: 27 },
            ],
        },
        {
            title: 'Pull',
            skills: [
            { name: 'Standing Head Down Intro Pull Technique', description: 'Learn the basics of the breaststroke pull.', index: 28 },
            { name: 'Breathe Every Stroke', description: 'Coordinate breathing with every stroke.', index: 29 },
            ],
        },
        {
            title: 'Kicking',
            skills: [
            { name: 'Synchronized Legs Kick', description: 'Perform synchronized leg kicks for propulsion.', index: 30 },
            { name: 'Kickboard + Head Down Kick', description: 'Practice kicking 10 yards with a kickboard and head down.', index: 31 },
            { name: 'Streamline Push Off Kick', description: 'Kick 10 yards in streamline position.', index: 32 },
            ],
        },
        {
            title: 'Stroke',
            skills: [
            { name: 'Timing', description: 'Master timing: pull in (arms/legs + breathe), push out (arms), sweep legs, head down.', index: 33 },
            ],
        },
        ],
    },
    {
        title: 'Butterfly',
        units: [
        {
            title: 'Introductory',
            skills: [
            { name: 'Wall Push Off', description: 'Hold a glide in Figure 11 position for 4 seconds.', index: 34 },
            ],
        },
        {
            title: 'Pull',
            skills: [
            { name: 'Standing Head Down Intro Pull Technique', description: 'Learn the basics of the butterfly pull.', index: 35 },
            { name: 'Breathe Every Stroke', description: 'Coordinate breathing with every stroke.', index: 36 },
            ],
        },
        {
            title: 'Kicking',
            skills: [
            { name: 'Synchronized Legs Kick', description: 'Perform synchronized leg kicks for butterfly.', index: 37 },
            { name: 'Kickboard + Head Down Kick', description: 'Practice kicking 10 yards with a kickboard and head down.', index: 38 },
            { name: 'Streamline Push Off Kick', description: 'Kick 10 yards in streamline position.', index: 39 },
            ],
        },
        {
            title: 'Stroke',
            skills: [
            { name: 'Timing', description: 'Master timing: pull in (arms/legs + breathe), push out (arms), sweep legs, head down.', index: 40 },
            ],
        },
        ],
    },
    ];

  
  