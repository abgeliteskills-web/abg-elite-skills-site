/*
  QUICK EDITING GUIDE

  Most ongoing updates for this site happen in this file.

  Camps:
  - Edit camp names, dates, ages, schedule, price, and Google Form links in `camps`
  - Keep `ages` and `schedule` lined up row-for-row
  - `featured: true` keeps a camp in the main site lineup

  Coaches:
  - Edit bios, teams, and headshots in `coaches`
  - `featured: true` keeps a coach on the homepage
  - `previewPosition` only affects the homepage headshot crop
  - `pathway` cards only show on the full coaches page

  Testimonials:
  - Edit the homepage testimonial slider in `testimonials`
*/

// CAMPS
// These cards power the camps page and any featured camp sections.
const camps = [
    {
      month: "June",
      title: "Summer Opener",
      shortDescription:
        "A fast reset for hands, feet, timing, and compete habits after the season.",
      fullDescription:
        "Monday focuses on puck touches and technical skill work. Friday shifts into battles and small-area games so players reconnect with pace, timing, and confidence.",
      dates: "June 15 & 19",
      location: "Downtown Community Arena, 10245 105 Ave, Edmonton",
      locationUrl:
        "https://www.google.com/maps/search/?api=1&query=Downtown+Community+Arena+10245+105+Ave+Edmonton",
      ages: ["2017-2019", "2014-2016", "2011-2013"],
      schedule: ["5:15 PM - 6:15 PM", "6:30 PM - 7:30 PM", "7:45 PM - 8:45 PM"],
      price: "$100",
      status: "Sold Out",
      availability: {
        label: "Sold Out",
        tone: "urgent",
      },
      featured: true,
      ratio: "2 hours total ice time",
      image: "./assets/web/camp-summer-opener.jpg",
      imagePosition: "center 60%",
      imageScale: 1,
      video: "./assets/june-summer-opener-reel.mp4",
      registrationUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSe5dbYjWqMRzDmrlEIfm7CgM3HWaQVweGBMq3oFdcvieOBznA/viewform?usp=header",
    },
    {
      month: "July",
      title: "Total Skill Integration",
      shortDescription:
        "A five-day camp covering skating, puck handling, passing, shooting, and game transfer.",
      fullDescription:
        "Each day focuses on a core skill area before players connect it in higher-paced drills and competition. This is the best fit for all-around development.",
      dates: "July 6-10",
      location: "KC Twin Arenas, 13160 140 Avenue NW, Edmonton",
      locationUrl:
        "https://www.google.com/maps/search/?api=1&query=KC+Twin+Arenas+13160+140+Avenue+NW+Edmonton",
      ages: ["2017-2019", "2014-2016", "2011-2013"],
      schedule: ["5:15 PM - 6:15 PM", "6:30 PM - 7:30 PM", "7:45 PM - 8:45 PM"],
      price: "$250",
      status: "Sold Out",
      availability: {
        label: "Sold Out",
        tone: "urgent",
      },
      featured: true,
      ratio: "5 hours total ice time",
      image: "./assets/July%20Image%20.avif",
      video: "./assets/camp-reel-total-skill-integration.mp4",
      imagePosition: "center 56%",
      registrationUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSeWPE7Z1zUAAYU2WSUCEqn_ckGgbYs6y_C4dmW8E_LHHJE3SA/viewform?usp=header",
    },
    {
      month: "August",
      title: "High-Performance Prep",
      shortDescription:
        "A four-day camp to sharpen pace, timing, and execution before evaluations.",
      fullDescription:
        "This final summer block helps players get back to game speed before the season starts, with a focus on execution, confidence, and compete habits.",
      dates: "August 4-7",
      location: "KC Twin Arenas, 13160 140 Avenue NW, Edmonton",
      locationUrl:
        "https://www.google.com/maps/search/?api=1&query=KC+Twin+Arenas+13160+140+Avenue+NW+Edmonton",
      ages: ["2017-2019", "2014-2016", "2011-2013"],
      schedule: ["5:15 PM - 6:15 PM", "6:30 PM - 7:30 PM", "7:45 PM - 8:45 PM"],
      price: "$200",
      status: "Sold Out",
      availability: {
        label: "Sold Out",
        tone: "urgent",
      },
      featured: true,
      ratio: "4 hours total ice time",
      image: "./assets/Aug%20Image.avif",
      video: "./assets/camp-highlights-2026.mp4",
      registrationUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLScevbK02WKHT4vNYHs78JzHiPEGCqQoJxAE3-_I5FmmqqEgvw/viewform?usp=header",
    },
    {
      month: "July",
      title: "Body Contact Prep Camp",
      shortDescription:
        "A two-day camp for players preparing for contact hockey.",
      fullDescription:
        "Players work on puck protection, body positioning, angling, and battle habits so they can handle contact situations with more confidence.",
      dates: "July 18 & 19",
      location: "KC Twin Arenas, 13160 140 Avenue NW, Edmonton",
      locationUrl:
        "https://www.google.com/maps/search/?api=1&query=KC+Twin+Arenas+13160+140+Avenue+NW+Edmonton",
      ages: ["2013+"],
      schedule: ["12:00 PM - 1:00 PM"],
      price: "$125",
      status: "Sold Out",
      availability: {
        label: "Sold Out",
        tone: "urgent",
      },
      featured: true,
      ratio: "2 hours total ice time",
      image: "./assets/web/camp-coaches-teaching.jpg",
      video: "./assets/body-contact-prep-reel.mp4",
      registrationUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSeKqm18D3uHm4KmBVOsWHptRRk_tklEXFLyCn8hEvuiQlDREA/viewform?usp=header",
    },
    {
      month: "July",
      title: "Position-Specific Clinic",
      shortDescription:
        "Position-specific reps with 4 current NCAA/pro coaches: forwards with Brett & Jordan, defencemen with Logan & Breck.",
      fullDescription:
        "Forwards and defencemen train in dedicated groups with current NCAA and pro players, focusing on habits, reads, and skills that match their position.",
      dates: "July 25 & 26",
      location: "KC Twin Arenas, 13160 140 Avenue NW, Edmonton",
      locationUrl:
        "https://www.google.com/maps/search/?api=1&query=KC+Twin+Arenas+13160+140+Avenue+NW+Edmonton",
      ages: ["2014-2016", "2011-2013"],
      // Older group also quietly accepts 2010-born players without advertising
      // that in the public age-group label.
      ageMatchOverrides: [null, "2010-2013"],
      schedule: ["12:00 PM - 1:00 PM", "1:15 PM - 2:15 PM"],
      price: "$90",
      status: "Sold Out",
      availability: {
        label: "Sold Out",
        tone: "urgent",
      },
      featured: true,
      ratio: "2 hours total ice time",
      image: "./assets/Position%20Specific%20Image.avif",
      video: "./assets/fd-clinic-reel-u15.mp4",
      registrationUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLScyyE3i7Hiqhz6Ja7cmHQQ5MA1ToqnkeTxz0Av2-hBRThMbyA/viewform?usp=header",
    },
];

// COACHES
// These entries power both the homepage coach preview and the full coaches page.
const coaches = [
    {
      name: "Logan Acheson",
      role: "KC Minor Hockey",
      minorHockeyLogo: "./assets/minor-hockey/kc-hockey-club.png",
      position: "Defence",
      currentTeam: "Pro",
      currentLevel: "",
      teamLine: "Pro · Alaska Anchorage (NCAA D1)",
      location: "Edmonton, AB",
      headshot: "./assets/logan-acheson-headshot.jpeg",
      previewPosition: "center 20%",
      mobilePreviewPosition: "center 15%",
      featured: true,
      highlights: [
        "Over 100 career NCAA games",
        "Assistant captain experience",
        "AJHL Most Points by a Defenceman",
      ],
      summary:
        "Logan brings a two-way defenceman’s lens to the ice, with a focus on mobility, habits, and game intelligence.",
      bio:
        "Raised in Edmonton and developed through KC Minor Hockey, Logan built his path from local hockey into junior leadership, NCAA Division I, and pro hockey. His coaching centers on elite defensive habits, mobility, and the small details that drive real game impact.",
      detailedBio:
        "Logan’s versatility as a defenceman makes him an invaluable asset to the ABG coaching team. With a focus on balancing defensive responsibility with offensive contribution, he emphasizes a well-rounded approach to the game. Logan is dedicated to instilling the importance of elite defensive habits and active involvement in the offensive zone. As a true student of the game, he is constantly evolving his craft to ensure his players are learning the most modern, high-level skills in the sport.",
      pathway: [
        {
          title: "University of Alaska Anchorage (NCAA)",
          image:
            "./assets/coach-logan-acheson-pathway-1-university-of-alaska-anchorage.jpg",
          imageAlt: "UAA Seawolves defenceman Logan Acheson in action during an NCAA Division 1 hockey game.",
          bullets: [
            "Over 100 career NCAA games",
            "Assistant captain",
            "Known as a high-IQ, all-around two-way defenceman",
          ],
        },
        {
          title: "Spruce Grove Saints (AJHL)",
          image:
            "./assets/coach-logan-acheson-pathway-2-spruce-grove-saints-ajhl.jpg",
          imageAlt: "ABG Elite Skills founder Logan Acheson as captain of the Spruce Grove Saints AJHL hockey team.",
          bullets: [
            "Led the Spruce Grove Saints as a premier captain",
            "AJHL Most Points by a Defenceman",
          ],
        },
        {
          title: "KC Centennials (U16 AAA)",
          image:
            "./assets/coach-logan-acheson-pathway-3-kc-centennials-u16-aaa.jpg",
          imageAlt: "ABG Elite Skills founder Logan Acheson as a captain for KC Minor Hockey in Edmonton.",
          bullets: [
            "Played 100% of minor hockey for the Knights of Columbus",
            "Developed through the Edmonton system to earn a D1 scholarship",
          ],
        },
      ],
    },
    {
      name: "Brett Rylance",
      role: "KC Minor Hockey",
      minorHockeyLogo: "./assets/minor-hockey/kc-hockey-club.png",
      position: "Forward",
      currentTeam: "Pro, France",
      currentLevel: "Ligue Magnus",
      teamLine: "Pro, France · Long Island (NCAA D1)",
      location: "Edmonton, AB",
      headshot:
        "./assets/coach-brett-rylance-headshot.jpg",
      previewPosition: "center 18%",
      mobilePreviewPosition: "center 13%",
      featured: true,
      highlights: [
        "Over 75 career NCAA points",
        "Assistant captain experience",
        "169 BCHL games with Chilliwack",
      ],
      summary:
        "Brett emphasizes speed, transition, offensive confidence, and the awareness needed to create at pace.",
      bio:
        "Brett’s experience in the BCHL, the NCAA, and now pro hockey in France gives him a strong feel for offense, transition, and what it takes to produce at the next level. His coaching helps players sharpen decision-making while leaning into their strengths.",
      detailedBio:
        "Brett’s experience as a top-tier forward in the BCHL and NCAA has equipped him with a deep understanding of what it takes to produce at the highest levels. His coaching focuses on the pillars of speed, situational awareness, and offensive transition. By encouraging players to embrace their individual strengths, Brett helps them elevate their game and find the confidence needed to compete in all-situation hockey.",
      pathway: [
        {
          title: "Long Island University (NCAA)",
          image:
            "./assets/coach-brett-rylance-pathway-1-long-island-university-ncaa.jpg",
          imageAlt: "ABG Elite Skills coach Brett Rylance wearing the A as alternate captain for the LIU Sharks NCAA Division I hockey team.",
          bullets: [
            "Over 75 career NCAA points",
            "Assistant captain",
            "2022-23 American International College Co-Rookie of the Year",
          ],
        },
        {
          title: "Chilliwack Chiefs (BCHL)",
          image:
            "./assets/coach-brett-rylance-pathway-2-chilliwack-chiefs-bchl.jpg",
          imageAlt: "ABG Elite Skills coach Brett Rylance in action for the Chilliwack Chiefs of the BCHL.",
          bullets: [
            "Played 169 games for the Chilliwack Chiefs",
            "Tallied 87 career points in one of the most competitive Junior A leagues",
          ],
        },
        {
          title: "KC Squires (U15 AAA)",
          image:
            "./assets/coach-brett-rylance-pathway-3-kc-squires-u15-aaa.jpg",
          imageAlt: "ABG Elite Skills coach Brett Rylance in action as a youth player for KC Minor Hockey in Edmonton.",
          bullets: [
            "Played 100% of minor hockey for the Knights of Columbus",
            "Developed through the Edmonton system to earn a D1 scholarship",
          ],
        },
      ],
    },
    {
      name: "Jordan Biro",
      role: "Sherwood Park Minor Hockey",
      minorHockeyLogo: "./assets/minor-hockey/sherwood-park-minor-hockey.png",
      position: "Forward",
      currentTeam: "Wichita Thunder",
      currentLevel: "ECHL",
      teamLine: "Wichita Thunder (ECHL) · AIC (NCAA D1)",
      location: "Sherwood Park, AB",
      headshot:
        "./assets/coach-jordan-biro-headshot.jpg",
      previewPosition: "center 17%",
      mobilePreviewPosition: "center 12%",
      featured: true,
      highlights: [
        "80 NCAA points across 166 games",
        "AJHL champion with Spruce Grove",
        "NCAA all-tournament recognition",
      ],
      summary:
        "Jordan brings an offensive, deceptive skill lens rooted in creativity, puck control, and small-area play.",
      bio:
        "Jordan adds pro and NCAA experience to the staff with a style centered on creativity and attacking confidence. He helps players build the deceptive habits and puck control that separate skilled offensive players.",
      detailedBio:
        "Jordan brings a high-octane offensive perspective to the staff, rooted in his experience at the NCAA and professional levels. He focuses on the deceptive side of the game, teaching players how to use creativity and elite puck control to break down defenders. Jordan is passionate about player development and believes that mastering small-area skills and offensive IQ is what separates good players from elite players.",
      pathway: [
        {
          title: "American International College (NCAA)",
          image:
            "./assets/coach-jordan-biro-pathway-1-american-international-college.jpg",
          imageAlt: "ABG Elite Skills instructor Jordan Biro playing NCAA Division I hockey for the AIC YellowJackets.",
          bullets: [
            "Recorded 80 career points across 166 NCAA games",
            "Named to the NCAA All-Tournament Team (2023-24)",
            "Served as an alternate captain for the AIC Yellow Jackets",
          ],
        },
        {
          title: "Spruce Grove Saints (AJHL)",
          image:
            "./assets/coach-jordan-biro-pathway-2-spruce-grove-saints-ajhl.jpg",
          imageAlt: "ABG Elite Skills coach Jordan Biro in action for the Spruce Grove Saints AJHL team.",
          bullets: [
            "AJHL champion with Spruce Grove",
            "Tallied 109 points in 155 games for the Saints",
            "Selected to the AJHL Selects team for the Junior Club World Cup in Sochi",
          ],
        },
      ],
    },
    {
      name: "Breck McKinley",
      role: "St. Albert Minor Hockey",
      minorHockeyLogo: "./assets/minor-hockey/st-albert-minor-hockey.png",
      position: "Defence",
      currentTeam: "Bowling Green State University",
      currentLevel: "NCAA",
      teamLine: "Bowling Green State (NCAA D1)",
      location: "St. Albert, AB",
      headshot:
        "./assets/coach-breck-mckinley-headshot.jpg",
      previewPosition: "center 15%",
      mobilePreviewPosition: "center 10%",
      featured: true,
      highlights: [
        "Over 100 career NCAA games",
        "CCHA Defenseman of the Week honors",
        "AJHL First All-Star Team finalist",
      ],
      summary:
        "Breck focuses on puck-moving detail, positioning, mobility, and modern defenceman habits.",
      bio:
        "Breck teaches the details that help defencemen control pace from the back end. His perspective blends junior production, NCAA consistency, and a sharp understanding of technical positioning and stick work.",
      detailedBio:
        "Breck specializes in the technical details of the modern puck-moving defenceman. His approach is centered on mobility, puck distribution, and the professional habits required to move from minor hockey into the junior and college ranks. Breck emphasizes the details: the small, high-level adjustments in positioning and stick work that allow players to control the pace of the game from the back end.",
      pathway: [
        {
          title: "Bowling Green State University (NCAA)",
          image:
            "./assets/coach-breck-mckinley-pathway-1-bowling-green-state-university.jpg",
          imageAlt: "Bowling Green defenceman and ABG Elite Skills coach Breck McKinley.",
          bullets: [
            "Named CCHA Defenseman of the Week twice",
            "Over 100 career NCAA games",
            "Consistent top-pairing defenceman",
          ],
        },
        {
          title: "Spruce Grove Saints (AJHL)",
          image:
            "./assets/coach-breck-mckinley-pathway-2-spruce-grove-saints-ajhl.jpg",
          imageAlt: "ABG Elite Skills coach Breck McKinley wearing the A as alternate captain for the Spruce Grove Saints.",
          bullets: [
            "Tallied 109 points in 134 games for the Saints",
            "Named to the AJHL First All-Star Team and finalist for AJHL Outstanding Defenceman",
            "Named assistant captain for Canada West at the World Junior A Challenge",
          ],
        },
      ],
    },
];

// TESTIMONIALS
// These entries power the homepage testimonial slider.
const testimonials = [
    {
      quote:
        "I have the highest praise for Logan and his camps and direct coaching sessions! His attention to detail is almost unbelievable.",
      name: "Marni W.",
      roleLabel: "Parent",
      team: "Google review",
      image: "./assets/Aug%20Image.avif",
      featured: true,
    },
    {
      quote:
        "My son loved these development camps. They were challenging, engaging and fun. The leadership and skill levels were fantastic.",
      name: "Adriana E.",
      roleLabel: "Parent",
      team: "Google review",
      image: "./assets/July%20Image%20.avif",
      featured: true,
    },
    {
      quote:
        "The games were really fun, the coaches had a good attitude, and they pushed my potential at the camp. It was fun, but we also worked hard. I would do that camp again.",
      name: "Cameron Olson",
      roleLabel: "Player",
      team: "KC U11 HADP Cougars",
      image: "./assets/web/camp-group-kneel.jpg",
      featured: true,
    },
    {
      quote:
        "The kids had an amazing time, and Logan and his team did such a great job making an effort with each player on the ice.",
      name: "Meagan O.",
      roleLabel: "Parent",
      team: "Google review",
      image: "./assets/Position%20Specific%20Image.avif",
      featured: true,
    },
    {
      quote:
        "My son has always enjoyed these camps. This will be his 3rd year as a returning player.",
      name: "Ron K.",
      roleLabel: "Parent",
      team: "Google review",
      image: "./assets/web/camp-coaches-teaching.jpg",
      featured: true,
    },
    {
      quote: "One of the best camps in Edmonton. Thanks coach Logan and team.",
      name: "Yic C.",
      roleLabel: "Google review",
      team: "",
      image: "./assets/web/camp-huddle.jpg",
      featured: true,
    },
];

window.siteData = {
  camps,
  coaches,
  testimonials,
};
