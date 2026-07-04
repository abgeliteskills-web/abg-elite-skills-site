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
      status: "Open",
      featured: true,
      isPast: true,
      ratio: "2 hours total ice time",
      image: "./Camp%20photo%202025.jpg",
      imagePosition: "center 60%",
      imageScale: 1,
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
      status: "Flagship",
      availability: {
        label: "Almost Full",
        tone: "limited",
      },
      featured: true,
      ratio: "5 hours total ice time",
      image: "./assets/July%20Image%20.avif",
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
      status: "Open",
      availability: {
        label: "Last 5 spots",
        tone: "limited",
      },
      featured: true,
      ratio: "4 hours total ice time",
      image: "./assets/Aug%20Image.avif",
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
      status: "Specialty",
      availability: {
        label: "Almost Full",
        tone: "limited",
      },
      featured: true,
      ratio: "2 hours total ice time",
      image: "./assets/20250808_181730%20copy.jpg?v=3",
      registrationUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSeKqm18D3uHm4KmBVOsWHptRRk_tklEXFLyCn8hEvuiQlDREA/viewform?usp=header",
    },
    {
      month: "July",
      title: "Position-Specific Clinic",
      shortDescription:
        "A two-day clinic for forwards and defensemen who want position-specific reps.",
      fullDescription:
        "Forwards and defensemen train in dedicated groups with current NCAA and pro players, focusing on habits, reads, and skills that match their position.",
      dates: "July 25 & 26",
      location: "KC Twin Arenas, 13160 140 Avenue NW, Edmonton",
      locationUrl:
        "https://www.google.com/maps/search/?api=1&query=KC+Twin+Arenas+13160+140+Avenue+NW+Edmonton",
      ages: ["2013-2015", "2010-2012"],
      schedule: ["12:00 PM - 1:00 PM", "1:15 PM - 2:15 PM"],
      price: "$90",
      status: "Specialty",
      availability: {
        label: "Spots available",
        tone: "open",
      },
      featured: true,
      ratio: "2 hours total ice time",
      image: "./assets/Position%20Specific%20Image.avif",
      registrationUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLScyyE3i7Hiqhz6Ja7cmHQQ5MA1ToqnkeTxz0Av2-hBRThMbyA/viewform?usp=header",
    },
    {
      month: "Year-Round",
      title: "Private Sessions",
      shortDescription:
        "Private, small-group, and team coaching booked directly with ABG.",
      fullDescription:
        "Private sessions can be built around one player, a small group, or a full team. Families and teams can reach out directly to set up the right fit.",
      dates: "Book by request",
      location: "Edmonton ice slots or team practices arranged directly with ABG",
      locationUrl:
        "mailto:abgeliteskills@gmail.com?subject=Private%20Session%20Inquiry",
      ages: ["Any age group", "Small groups", "Team coaching"],
      schedule: ["Flexible scheduling", "Private 1-on-1", "Available by request"],
      price: "Contact for rates",
      status: "Private",
      featured: false,
      ratio: "Personalized instruction",
      image: "./assets/About%20Hero.jpg",
      imagePosition: "center 24%",
      registrationUrl:
        "mailto:abgeliteskills@gmail.com?subject=Private%20Session%20Inquiry",
    },
];

// COACHES
// These entries power both the homepage coach preview and the full coaches page.
const coaches = [
    {
      name: "Logan Acheson",
      role: "KC Minor Hockey",
      position: "Defense",
      currentTeam: "University of Alaska Anchorage",
      currentLevel: "NCAA",
      location: "Edmonton, AB",
      headshot:
        "https://static.wixstatic.com/media/a00900_ee6055e0424441258b4b7f0f0d2dbcb8~mv2.jpg/v1/fill/w_720%2Ch_760%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/screenshot_20251124_114428_brave_edited_edited.jpg",
      previewPosition: "center 16%",
      mobilePreviewPosition: "center 12%",
      featured: true,
      highlights: [
        "Over 100 career NCAA games",
        "Assistant captain experience",
        "AJHL Most Points by a Defenseman",
      ],
      summary:
        "Logan brings a two-way defenseman’s lens to the ice, with a focus on mobility, habits, and game intelligence.",
      bio:
        "Raised in Edmonton and developed through KC Minor Hockey, Logan built his path from local hockey into junior leadership and NCAA competition. His coaching centers on elite defensive habits, mobility, and the small details that drive real game impact.",
      detailedBio:
        "Logan’s versatility as a defenseman makes him an invaluable asset to the ABG coaching team. With a focus on balancing defensive responsibility with offensive contribution, he emphasizes a well-rounded approach to the game. Logan is dedicated to instilling the importance of elite defensive habits and active involvement in the offensive zone. As a true student of the game, he is constantly evolving his craft to ensure his players are learning the most modern, high-level skills in the sport.",
      pathway: [
        {
          title: "University of Alaska Anchorage (NCAA)",
          image:
            "https://static.wixstatic.com/media/a00900_43074e07c3b44db48ee040ab228d8232~mv2.jpg/v1/fill/w_900,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1s5a0313.jpg",
          imageAlt: "UAA Seawolves defenseman Logan Acheson in action during an NCAA Division 1 hockey game.",
          bullets: [
            "Over 100 career NCAA games",
            "Assistant captain",
            "Known as a high-IQ, all-around two-way defenseman",
          ],
        },
        {
          title: "Spruce Grove Saints (AJHL)",
          image:
            "https://static.wixstatic.com/media/a00900_bffbc6052e434132aeab6c1943dbd898~mv2.jpg/v1/fill/w_900,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/17910687395920574_heic.jpg",
          imageAlt: "ABG Elite Skills founder Logan Acheson as captain of the Spruce Grove Saints AJHL hockey team.",
          bullets: [
            "Led the Spruce Grove Saints as a premier captain",
            "AJHL Most Points by a Defenseman",
          ],
        },
        {
          title: "KC Centennials (U16 AAA)",
          image:
            "https://static.wixstatic.com/media/a00900_6cbf43aeaf9c4567851909d5ccbe8f1b~mv2.jpg/v1/fill/w_900,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/18021142534932454_heic.jpg",
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
      position: "Forward",
      currentTeam: "Long Island University",
      currentLevel: "NCAA",
      location: "Edmonton, AB",
      headshot:
        "https://static.wixstatic.com/media/a00900_0b13bc7d4a3d430083761325cd95d380~mv2.jpg/v1/fill/w_720%2Ch_760%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/a00900_0b13bc7d4a3d430083761325cd95d380~mv2.jpg",
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
        "Brett’s experience in the BCHL and NCAA gives him a strong feel for offense, transition, and what it takes to produce at the next level. His coaching helps players sharpen decision-making while leaning into their strengths.",
      detailedBio:
        "Brett’s experience as a top-tier forward in the BCHL and NCAA has equipped him with a deep understanding of what it takes to produce at the highest levels. His coaching focuses on the pillars of speed, situational awareness, and offensive transition. By encouraging players to embrace their individual strengths, Brett helps them elevate their game and find the confidence needed to compete in all-situation hockey.",
      pathway: [
        {
          title: "Long Island University (NCAA)",
          image:
            "https://static.wixstatic.com/media/a00900_f92075c7ec3342258c56e476b33fbd62~mv2.png/v1/fill/w_900,h_900,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/a00900_f92075c7ec3342258c56e476b33fbd62~mv2.png",
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
            "https://static.wixstatic.com/media/a00900_ce63144b7ce741d9ae68ccbcbb90fd73~mv2.jpg/v1/fill/w_900,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a00900_ce63144b7ce741d9ae68ccbcbb90fd73~mv2.jpg",
          imageAlt: "ABG Elite Skills coach Brett Rylance in action for the Chilliwack Chiefs of the BCHL.",
          bullets: [
            "Played 169 games for the Chilliwack Chiefs",
            "Tallied 87 career points in one of the most competitive Junior A leagues",
          ],
        },
        {
          title: "KC Squires (U15 AAA)",
          image:
            "https://static.wixstatic.com/media/a00900_5dfc6256822a4cbea5b8db3f9a19e2f0~mv2.jpg/v1/fill/w_900,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a00900_5dfc6256822a4cbea5b8db3f9a19e2f0~mv2.jpg",
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
      position: "Forward",
      currentTeam: "Greensboro Gargoyles",
      currentLevel: "ECHL",
      location: "Sherwood Park, AB",
      headshot:
        "https://static.wixstatic.com/media/a00900_306c6647526b48eeb475c7e94fd75d85~mv2.jpg/v1/fill/w_720%2Ch_760%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/screenshot_20250106_101942_chrome.jpg",
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
            "https://static.wixstatic.com/media/a00900_5883a787918c4cdb9da7c34d632167a8~mv2.png/v1/fill/w_900,h_900,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/screenshot_20240827_192757_snapchat_edit.png",
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
            "https://static.wixstatic.com/media/a00900_6111ab75741149e5b10f074c546a6936~mv2.png/v1/fill/w_900,h_900,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/17929995320920582_edited.png",
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
      role: "St Albert Minor Hockey",
      position: "Defense",
      currentTeam: "Bowling Green State University",
      currentLevel: "NCAA",
      location: "St. Albert, AB",
      headshot:
        "https://static.wixstatic.com/media/a00900_ed1e09d3f5164d049172e2164d5d85b9~mv2.png/v1/fill/w_720%2Ch_760%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/a00900_ed1e09d3f5164d049172e2164d5d85b9~mv2.png",
      previewPosition: "center 15%",
      mobilePreviewPosition: "center 10%",
      featured: true,
      highlights: [
        "Over 100 career NCAA games",
        "CCHA Defenseman of the Week honors",
        "AJHL First All-Star Team finalist",
      ],
      summary:
        "Breck focuses on puck-moving detail, positioning, mobility, and modern defenseman habits.",
      bio:
        "Breck teaches the details that help defensemen control pace from the back end. His perspective blends junior production, NCAA consistency, and a sharp understanding of technical positioning and stick work.",
      detailedBio:
        "Breck specializes in the technical details of the modern puck-moving defenseman. His approach is centered on mobility, puck distribution, and the professional habits required to move from minor hockey into the junior and college ranks. Breck emphasizes the details: the small, high-level adjustments in positioning and stick work that allow players to control the pace of the game from the back end.",
      pathway: [
        {
          title: "Bowling Green State University (NCAA)",
          image:
            "https://static.wixstatic.com/media/a00900_46f86f9895404fa8b3ad81a018815c4f~mv2.jpg/v1/fill/w_900,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/18038081810362580_heic.jpg",
          imageAlt: "Bowling Green defenseman and ABG Elite Skills coach Breck McKinley.",
          bullets: [
            "Named CCHA Defenseman of the Week twice",
            "Over 100 career NCAA games",
            "Consistent top-pairing defenseman",
          ],
        },
        {
          title: "Spruce Grove Saints (AJHL)",
          image:
            "https://static.wixstatic.com/media/a00900_b29efcdd0d7c46bab8724b590e3935ca~mv2.jpg/v1/fill/w_900,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/18041215298323903_heic.jpg",
          imageAlt: "ABG Elite Skills coach Breck McKinley wearing the A as alternate captain for the Spruce Grove Saints.",
          bullets: [
            "Tallied 109 points in 134 games for the Saints",
            "Named to the AJHL First All-Star Team and finalist for AJHL Outstanding Defenseman",
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
        "The games were really fun, the coaches had a good attitude, and they pushed my potential at the camp. It was fun, but we also worked hard. I would do that camp again.",
      name: "Cameron Olson",
      roleLabel: "Player",
      team: "KC U11 HADP Cougars",
      image: "./assets/20250711_201636%20copy.jpg",
      featured: true,
    },
    {
      quote:
        "By the second day, Hayden’s confidence had completely changed.",
      name: "Parent of U13 Participant",
      roleLabel: "Parent",
      team: "ABG family",
      image: "./assets/20250808_181730%20copy.jpg",
      featured: true,
    },
    {
      quote:
        "Great communication with kids! My child struggles with following instructions, and for the first time, he was able to focus and follow directions. I strongly believe this is because of the great coaching team. My son loved this camp!",
      name: "Parent of U9 Participant",
      roleLabel: "Parent",
      team: "ABG family",
      image: "./assets/20250711_195811.jpg",
      featured: true,
    },
];

window.siteData = {
  camps,
  coaches,
  testimonials,
};
