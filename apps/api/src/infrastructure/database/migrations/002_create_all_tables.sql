-- backend/src/infrastructure/database/migrations/002_create_all_tables.sql
-- =====================================
-- DOKUMENTE
-- =====================================
CREATE TABLE
  IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM (
      'satzung',
      'protokolle',
      'formulare',
      'richtlinien',
      'guides'
    ) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    status ENUM ('current', 'outdated', 'draft') DEFAULT 'current',
    published_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NULL,
    author VARCHAR(100),
    downloads INT UNSIGNED DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
  );

-- Document Tags (M:N Beziehung)
CREATE TABLE
  IF NOT EXISTS document_tags (
    document_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (document_id, tag),
    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
    INDEX idx_tag (tag)
  );

-- =====================================
-- FAQ
-- =====================================
CREATE TABLE
  IF NOT EXISTS faqs (
    id VARCHAR(36) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category ENUM (
      'mitgliedschaft',
      'events',
      'verein',
      'technik',
      'sonstige'
    ) NOT NULL,
    order_position INT NOT NULL DEFAULT 0,
    views INT UNSIGNED DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_popular (is_popular),
    INDEX idx_order (order_position)
  );

-- FAQ Tags
CREATE TABLE
  IF NOT EXISTS faq_tags (
    faq_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (faq_id, tag),
    FOREIGN KEY (faq_id) REFERENCES faqs (id) ON DELETE CASCADE,
    INDEX idx_tag (tag)
  );

-- Related FAQs
CREATE TABLE
  IF NOT EXISTS faq_relations (
    faq_id VARCHAR(36) NOT NULL,
    related_faq_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (faq_id, related_faq_id),
    FOREIGN KEY (faq_id) REFERENCES faqs (id) ON DELETE CASCADE,
    FOREIGN KEY (related_faq_id) REFERENCES faqs (id) ON DELETE CASCADE
  );

-- =====================================
-- NEWSLETTER
-- =====================================
CREATE TABLE
  IF NOT EXISTS newsletters (
    id VARCHAR(36) PRIMARY KEY,
    edition INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    published_at TIMESTAMP NOT NULL,
    status ENUM ('draft', 'published', 'archived') DEFAULT 'draft',
    header_image VARCHAR(500),
    introduction TEXT NOT NULL,
    closing_message TEXT,
    next_edition_hint TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_edition (edition),
    INDEX idx_published (published_at)
  );

-- Newsletter Authors
CREATE TABLE
  IF NOT EXISTS newsletter_authors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- Newsletter Articles
CREATE TABLE
  IF NOT EXISTS newsletter_articles (
    id VARCHAR(36) PRIMARY KEY,
    newsletter_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    team_id VARCHAR(36),
    team_name VARCHAR(100),
    category ENUM (
      'team-update',
      'event-recap',
      'announcement',
      'community',
      'esports',
      'baller-league',
      'feature'
    ) NOT NULL,
    order_position INT NOT NULL DEFAULT 0,
    reading_time INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (newsletter_id) REFERENCES newsletters (id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES newsletter_authors (id),
    INDEX idx_newsletter (newsletter_id),
    INDEX idx_category (category),
    INDEX idx_order (order_position)
  );

-- Newsletter Images
CREATE TABLE
  IF NOT EXISTS newsletter_article_images (
    id VARCHAR(36) PRIMARY KEY,
    article_id VARCHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    caption TEXT,
    position ENUM ('inline', 'header', 'gallery') DEFAULT 'inline',
    order_position INT DEFAULT 0,
    FOREIGN KEY (article_id) REFERENCES newsletter_articles (id) ON DELETE CASCADE,
    INDEX idx_article (article_id)
  );

-- Newsletter Tags
CREATE TABLE
  IF NOT EXISTS newsletter_tags (
    newsletter_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (newsletter_id, tag),
    FOREIGN KEY (newsletter_id) REFERENCES newsletters (id) ON DELETE CASCADE
  );

-- Newsletter Article Tags
CREATE TABLE
  IF NOT EXISTS newsletter_article_tags (
    article_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (article_id, tag),
    FOREIGN KEY (article_id) REFERENCES newsletter_articles (id) ON DELETE CASCADE
  );

-- Newsletter Subscriptions
CREATE TABLE
  IF NOT EXISTS newsletter_subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    accepts_marketing BOOLEAN DEFAULT TRUE,
    confirmed_at TIMESTAMP NULL,
    unsubscribed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_confirmed (confirmed_at)
  );

-- =====================================
-- GREMIEN (Organisation)
-- =====================================
CREATE TABLE
  IF NOT EXISTS gremien (
    id VARCHAR(36) PRIMARY KEY,
    type ENUM (
      'vorstand',
      'beirat',
      'team_event',
      'team_medien',
      'team_technik',
      'team_verein',
      'kassenpruefung'
    ) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    header_image VARCHAR(500),
    gradient VARCHAR(100) NOT NULL,
    meeting_schedule VARCHAR(255),
    contact_email VARCHAR(255),
    established_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type)
  );

-- Gremium Members
CREATE TABLE
  IF NOT EXISTS gremium_members (
    id VARCHAR(36) PRIMARY KEY,
    gremium_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    image VARCHAR(500),
    description TEXT,
    member_since DATE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    order_position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gremium_id) REFERENCES gremien (id) ON DELETE CASCADE,
    INDEX idx_gremium (gremium_id)
  );

-- Gremium Responsibilities
CREATE TABLE
  IF NOT EXISTS gremium_responsibilities (
    id VARCHAR(36) PRIMARY KEY,
    gremium_id VARCHAR(36) NOT NULL,
    responsibility TEXT NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (gremium_id) REFERENCES gremien (id) ON DELETE CASCADE,
    INDEX idx_gremium (gremium_id)
  );

-- Member Responsibilities
CREATE TABLE
  IF NOT EXISTS member_responsibilities (
    id VARCHAR(36) PRIMARY KEY,
    member_id VARCHAR(36) NOT NULL,
    responsibility TEXT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES gremium_members (id) ON DELETE CASCADE,
    INDEX idx_member (member_id)
  );

-- Gremium Highlights
CREATE TABLE
  IF NOT EXISTS gremium_highlights (
    id VARCHAR(36) PRIMARY KEY,
    gremium_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE,
    order_position INT DEFAULT 0,
    FOREIGN KEY (gremium_id) REFERENCES gremien (id) ON DELETE CASCADE,
    INDEX idx_gremium (gremium_id)
  );

-- Gremium Images
CREATE TABLE
  IF NOT EXISTS gremium_images (
    gremium_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    order_position INT DEFAULT 0,
    PRIMARY KEY (gremium_id, image_url),
    FOREIGN KEY (gremium_id) REFERENCES gremien (id) ON DELETE CASCADE
  );

-- =====================================
-- CREATORS
-- =====================================
CREATE TABLE
  IF NOT EXISTS creators (
    id VARCHAR(36) PRIMARY KEY,
    member_id VARCHAR(36) NOT NULL,
    artist_name VARCHAR(100) NOT NULL,
    real_name VARCHAR(100),
    profile_image VARCHAR(500),
    description TEXT NOT NULL,
    portfolio VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    active_since DATE NOT NULL,
    deactivated_at DATE,
    instagram VARCHAR(100),
    twitter VARCHAR(100),
    facebook VARCHAR(100),
    youtube VARCHAR(100),
    tiktok VARCHAR(100),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES mitglieder (id),
    INDEX idx_active (is_active),
    INDEX idx_member (member_id)
  );

-- Creator Types
CREATE TABLE
  IF NOT EXISTS creator_types (
    creator_id VARCHAR(36) NOT NULL,
    type ENUM ('grafik', 'foto', 'video', 'musik', 'other') NOT NULL,
    PRIMARY KEY (creator_id, type),
    FOREIGN KEY (creator_id) REFERENCES creators (id) ON DELETE CASCADE
  );

-- Creator Works
CREATE TABLE
  IF NOT EXISTS creator_works (
    id VARCHAR(36) PRIMARY KEY,
    creator_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM ('image', 'video', 'audio', 'text') NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    is_public BOOLEAN DEFAULT FALSE,
    order_position INT DEFAULT 0,
    views INT UNSIGNED DEFAULT 0,
    likes INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (creator_id) REFERENCES creators (id) ON DELETE CASCADE,
    INDEX idx_creator (creator_id),
    INDEX idx_public (is_public),
    INDEX idx_type (type)
  );

-- Creator Work Tags
CREATE TABLE
  IF NOT EXISTS creator_work_tags (
    work_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (work_id, tag),
    FOREIGN KEY (work_id) REFERENCES creator_works (id) ON DELETE CASCADE
  );

-- =====================================
-- TEAM HISTORY
-- =====================================
CREATE TABLE
  IF NOT EXISTS team_history_years (
    id VARCHAR(36) PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_year (year)
  );

-- Fanini Year Comments
CREATE TABLE
  IF NOT EXISTS fanini_year_comments (
    id VARCHAR(36) PRIMARY KEY,
    year_id VARCHAR(36) NOT NULL UNIQUE,
    headline VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    outlook TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (year_id) REFERENCES team_history_years (id) ON DELETE CASCADE
  );

-- Fanini Highlights/Lowlights
CREATE TABLE
  IF NOT EXISTS fanini_year_highlights (
    id VARCHAR(36) PRIMARY KEY,
    comment_id VARCHAR(36) NOT NULL,
    type ENUM ('highlight', 'lowlight') NOT NULL,
    content TEXT NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (comment_id) REFERENCES fanini_year_comments (id) ON DELETE CASCADE,
    INDEX idx_comment (comment_id)
  );

-- Team History Entries
CREATE TABLE
  IF NOT EXISTS team_history_entries (
    id VARCHAR(36) PRIMARY KEY,
    year_id VARCHAR(36) NOT NULL,
    team_type ENUM ('lol', 'baller', 'fanini', 'fern', 'other') NOT NULL,
    fanini_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (year_id) REFERENCES team_history_years (id) ON DELETE CASCADE,
    INDEX idx_year (year_id),
    INDEX idx_type (team_type)
  );

-- Special Events
CREATE TABLE
  IF NOT EXISTS team_history_special_events (
    id VARCHAR(36) PRIMARY KEY,
    year_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    category ENUM (
      'championship',
      'celebration',
      'milestone',
      'other'
    ) NOT NULL,
    video_url VARCHAR(500),
    order_position INT DEFAULT 0,
    FOREIGN KEY (year_id) REFERENCES team_history_years (id) ON DELETE CASCADE,
    INDEX idx_year (year_id)
  );

-- Special Event Images
CREATE TABLE
  IF NOT EXISTS special_event_images (
    event_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    order_position INT DEFAULT 0,
    PRIMARY KEY (event_id, image_url),
    FOREIGN KEY (event_id) REFERENCES team_history_special_events (id) ON DELETE CASCADE
  );

-- =====================================
-- LOL TEAM CONTENT
-- =====================================
CREATE TABLE
  IF NOT EXISTS lol_content (
    id VARCHAR(36) PRIMARY KEY,
    entry_id VARCHAR(36) NOT NULL UNIQUE,
    FOREIGN KEY (entry_id) REFERENCES team_history_entries (id) ON DELETE CASCADE
  );

-- LoL Players
CREATE TABLE
  IF NOT EXISTS lol_players (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    ign VARCHAR(50) NOT NULL,
    real_name VARCHAR(100),
    role ENUM ('Top', 'Jungle', 'Mid', 'Bot', 'Support') NOT NULL,
    joined_date DATE,
    left_date DATE,
    twitter VARCHAR(100),
    instagram VARCHAR(100),
    twitch VARCHAR(100),
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES lol_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- LoL Coaches
CREATE TABLE
  IF NOT EXISTS lol_coaches (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    period VARCHAR(50) NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES lol_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- LoL Achievements
CREATE TABLE
  IF NOT EXISTS lol_achievements (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES lol_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- LoL Seasons
CREATE TABLE
  IF NOT EXISTS lol_seasons (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    placement INT NOT NULL,
    wins INT NOT NULL,
    losses INT NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES lol_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- LoL Tournaments
CREATE TABLE
  IF NOT EXISTS lol_tournaments (
    id VARCHAR(36) PRIMARY KEY,
    season_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    placement VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (season_id) REFERENCES lol_seasons (id) ON DELETE CASCADE,
    INDEX idx_season (season_id)
  );

-- LoL Highlights
CREATE TABLE
  IF NOT EXISTS lol_highlights (
    content_id VARCHAR(36) NOT NULL,
    highlight TEXT NOT NULL,
    order_position INT DEFAULT 0,
    PRIMARY KEY (content_id, order_position),
    FOREIGN KEY (content_id) REFERENCES lol_content (id) ON DELETE CASCADE
  );

-- =====================================
-- BALLER LEAGUE CONTENT
-- =====================================
CREATE TABLE
  IF NOT EXISTS baller_content (
    id VARCHAR(36) PRIMARY KEY,
    entry_id VARCHAR(36) NOT NULL UNIQUE,
    FOREIGN KEY (entry_id) REFERENCES team_history_entries (id) ON DELETE CASCADE
  );

-- Baller Players
CREATE TABLE
  IF NOT EXISTS baller_players (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    position ENUM ('TW', 'IV', 'LV', 'RV', 'ZM', 'LM', 'RM', 'ST') NOT NULL,
    jersey_number INT,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    appearances INT DEFAULT 0,
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES baller_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- Baller Coaches
CREATE TABLE
  IF NOT EXISTS baller_coaches (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    period VARCHAR(50) NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES baller_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- Baller Season Stats
CREATE TABLE
  IF NOT EXISTS baller_season_stats (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL UNIQUE,
    played INT NOT NULL,
    won INT NOT NULL,
    drawn INT NOT NULL,
    lost INT NOT NULL,
    goals_for INT NOT NULL,
    goals_against INT NOT NULL,
    points INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (content_id) REFERENCES baller_content (id) ON DELETE CASCADE
  );

-- Baller Match Highlights
CREATE TABLE
  IF NOT EXISTS baller_match_highlights (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    opponent VARCHAR(100) NOT NULL,
    result VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES baller_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- Baller Final Table
CREATE TABLE
  IF NOT EXISTS baller_final_table (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    position INT NOT NULL,
    team VARCHAR(100) NOT NULL,
    played INT NOT NULL,
    points INT NOT NULL,
    goal_difference VARCHAR(20) NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES baller_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- =====================================
-- FANINI CONTENT
-- =====================================
CREATE TABLE
  IF NOT EXISTS fanini_content (
    id VARCHAR(36) PRIMARY KEY,
    entry_id VARCHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    members INT NOT NULL,
    founded_date DATE,
    FOREIGN KEY (entry_id) REFERENCES team_history_entries (id) ON DELETE CASCADE
  );

-- Fanini Activities
CREATE TABLE
  IF NOT EXISTS fanini_activities (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    participants INT,
    description TEXT NOT NULL,
    order_position INT DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES fanini_content (id) ON DELETE CASCADE,
    INDEX idx_content (content_id)
  );

-- Fanini Activity Images
CREATE TABLE
  IF NOT EXISTS fanini_activity_images (
    activity_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    order_position INT DEFAULT 0,
    PRIMARY KEY (activity_id, image_url),
    FOREIGN KEY (activity_id) REFERENCES fanini_activities (id) ON DELETE CASCADE
  );

-- Fanini Content Images
CREATE TABLE
  IF NOT EXISTS fanini_content_images (
    content_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    order_position INT DEFAULT 0,
    PRIMARY KEY (content_id, image_url),
    FOREIGN KEY (content_id) REFERENCES fanini_content (id) ON DELETE CASCADE
  );

-- =====================================
-- ORGANISATION STRUCTURE
-- =====================================
CREATE TABLE
  IF NOT EXISTS organization_nodes (
    id VARCHAR(36) PRIMARY KEY,
    parent_id VARCHAR(36),
    name VARCHAR(100) NOT NULL,
    type ENUM (
      'root',
      'partner',
      'department',
      'team',
      'external'
    ) NOT NULL,
    description TEXT,
    member_count INT,
    team_lead VARCHAR(100),
    email VARCHAR(255),
    logo VARCHAR(500),
    color VARCHAR(50),
    link VARCHAR(500),
    is_external BOOLEAN DEFAULT FALSE,
    order_position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES organization_nodes (id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id),
    INDEX idx_type (type)
  );
