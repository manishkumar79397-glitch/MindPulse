class AppStrings {
  static const Map<String, Map<String, String>> _localizedValues = {
    'hi': {
      'greeting': 'Namaste, Aai 🌸',
      'home_subtitle': 'Aap aaj kya karna chahengi?',
      'btn_play_game': 'KHEL KHELEIN',
      'btn_my_routine': 'MERI DAWA AUR ROUTINE',
      'btn_voice_assist': 'MANSAATHI SE BAAT KAREIN',
      'btn_my_progress': 'MERA ABHYAS',
      'btn_help_sos': 'MADAT / SOS',
      'voice_guide': 'Audio Margadarshan',
      'taken': 'Li gayi',
      'remind_later': 'Baad mein',
      'well_done': 'Bahut Sundar! Shabash.',
      'back': 'Peeche',
      'sos_sent_title': 'Madat Sandesh Bheja Gaya',
      'sos_sent_desc': 'Aapke parivar ko location ke saath suchna bhej di gayi hai.',
    },
    'en': {
      'greeting': 'Namaste, Aai 🌸',
      'home_subtitle': 'What would you like to do today?',
      'btn_play_game': 'PLAY GAMES',
      'btn_my_routine': 'MY ROUTINE & MEDICINES',
      'btn_voice_assist': 'TALK TO MANSAATHI',
      'btn_my_progress': 'MY DAILY PROGRESS',
      'btn_help_sos': 'HELP / SOS',
      'voice_guide': 'Voice Guidance',
      'taken': 'Taken',
      'remind_later': 'Remind Later',
      'well_done': 'Wonderful! Well done.',
      'back': 'Back',
      'sos_sent_title': 'Emergency Alert Dispatched',
      'sos_sent_desc': 'Your family has been alerted with your location pin.',
    },
    'as': {
      'greeting': 'Namaskar, Aai 🌸',
      'home_subtitle': 'Aaji apuni ki koribo bisare?',
      'btn_play_game': 'KHEL KHELU',
      'btn_my_routine': 'MUKHYO NIYAM ARU OUKHUDH',
      'btn_voice_assist': 'MANSAATHIR LOGOT KOTHA PATU',
      'btn_my_progress': 'AAMAR PRAGATI',
      'btn_help_sos': 'SOHAI / SOS',
      'voice_guide': 'Audio Sahay',
      'taken': 'Khalo',
      'remind_later': 'Pisot',
      'well_done': 'Khub bhal hoise! Dhanyabad.',
      'back': 'Pisot',
      'sos_sent_title': 'Sohai Barta Pothuwa Hol',
      'sos_sent_desc': 'Poriyalor manuhe sthanor logot barta paisey.',
    }
  };

  static String get(String key, {String language = 'hi'}) {
    return _localizedValues[language]?[key] ?? _localizedValues['hi']?[key] ?? key;
  }
}

