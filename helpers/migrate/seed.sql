BEGIN TRANSACTION;

INSERT INTO
  "events"
VALUES
  (
    'ce112ec8-4db3-415c-88c7-bfff3f48d66d',
    'malro.org',
    'published',
    '2023-08-01T12:13:05.479Z',
    '["example.org","malro.org"]',
    4.41134023666382,
    45.0113182067871,
    'FR',
    '84000',
    'Avignon',
    '18, Place du Marché',
    'Europe/Paris',
    '["literature","documentary","movie"]',
    0,
    99,
    30,
    'false',
    '2023-06-18T12:45',
    '[{"data":"contact@example.com","type":"email"},{"data":"+33 (0)4 90 56 58 14","type":"phone"},{"data":"sur place (à 19h max.)","type":"string"},{"data":"https://www.billet-reduc.fr","allows_affiliate_partnership":null,"type":"url"}]',
    NULL,
    'http://localhost:3000/datastore/images/ce112ec8-4db3-415c-88c7-bfff3f48d66d.webp?v=1692082248133',
    NULL,
    'EUR',
    '[{"lang":"fr","url":"https://www.example.com","title":"La femme de Tchaïkovski","organizer":"Le Cinéma !","content":"Serebrenikov met sa virtuosité tourbillonnante, sa démesure baroque au service de cette chute, qui est aussi une résistance, dans laquelle on peut aisément lire une vision de la Russie éternelle, donc contemporaine. Russie, 19ème siècle. Antonina Miliukova, jeune femme aisée et apprentie pianiste, épouse le compositeur Piotr Tchaïkovski. Mais l’amour qu’elle lui porte n’est pas réciproque et la jeune femme est violemment rejetée. Consumée par ses sentiments, Antonina accepte de tout endurer pour rester auprès de lui.","detail":"André Malraux, né le 3 novembre 1901 dans le 18e arrondissement de Paris et mort le 23 novembre 1976 à Créteil (Val-de-Marne), est un écrivain, aventurier, homme politique et intellectuel français. Essentiellement autodidacte et tenté par l''aventure, André Malraux gagne l''Indochine avec son épouse Clara Malraux, où il participe à un journal anticolonialiste et est emprisonné en 1923-1924 pour vol et recel d''antiquités sacrées khmères. Revenu en France, il transpose cette aventure dans son roman La Voie royale publié en 1930, et gagne la célébrité dans la francophonie avec la parution en 1933 de La Condition humaine, un roman d''aventure et d''engagement qui s''inspire des soubresauts révolutionnaires de la Chine et obtient le prix Goncourt."},{"lang":"en","url":"https://www.example.com","title":"Tchaikovsky''s Wife","organizer":"Le Cinéma !","content":"Serebrenikov puts his swirling virtuosity, his baroque excess at the service of this fall, which is also a resistance, in which one can easily read a vision of eternal Russia, therefore contemporary. Russia, 19th century. Antonina Miliukova, a well-to-do young woman and an apprentice pianist, marries the composer Piotr Tchaikovsky. But the love she has for him is not reciprocated and the young woman is violently rejected. Consumed by her feelings, Antonina agrees to endure everything to stay with him.","detail":"André Malraux, born November 3, 1901 in the 18th arrondissement of Paris and died November 23, 1976 in Créteil (Val-de-Marne), was a French writer, adventurer, politician and intellectual. Essentially self-taught and tempted by adventure, André Malraux went to Indochina with his wife Clara Malraux, where he contributed to an anti-colonialist newspaper and was imprisoned in 1923-1924 for theft and concealment of sacred Khmer antiquities. Returning to France, he transposed this adventure into his novel La Voie royale published in 1930, and gained fame in the French-speaking world with the publication in 1933 of La Condition humaine, a novel of adventure and commitment inspired by the upheavals Revolutionaries of China and won the Goncourt Prize."},{"lang":"ru","url":"https://www.example.com","title":"жена Чайковского","organizer":"Кинотеатр","content":"Серебреников ставит свою закрученную виртуозность, свою барочную излишество на службу этой осени, которая также является сопротивлением, в котором легко прочитывается видение вечной России, а потому современной. Россия, 19 век. Антонина Милюкова, состоятельная молодая женщина, начинающая пианистка, выходит замуж за композитора Петра Чайковского. Но любовь, которую она испытывает к нему, не взаимна, и молодая женщина жестоко отвергнута. Поглощенная своими чувствами, Антонина соглашается терпеть все, чтобы остаться с ним.","detail":"Андре Мальро, родившийся 3 ноября 1901 года в 18-м округе Парижа и умерший 23 ноября 1976 года в Кретей (Валь-де-Марн), был французским писателем, авантюристом, политиком и интеллектуалом. По существу самоучка и соблазненный приключениями, Андре Мальро отправился в Индокитай со своей женой Кларой Мальро, где он сотрудничал с антиколониалистской газетой и был заключен в тюрьму в 1923-1924 годах за кражу и сокрытие священных кхмерских древностей. Вернувшись во Францию, он перенес это приключение в свой роман «Королевская дорога», опубликованный в 1930 году, и приобрел известность во франкоязычном мире после публикации в 1933 году «Человеческого состояния», романа о приключениях и обязательствах, вдохновленного потрясениями китайских революционеров. и получил Гонкуровскую премию."}]',
    '[{"adult_fee":20,"child_fee":20,"feature":["wheelchair_accessible","relax"],"audio_lang":"ru","start":"2023-09-30T19:30","end":"2023-09-30T21:30"}]',
    'contact@example.com',
    NULL
  );

INSERT INTO
  "events"
VALUES
  (
    '29b4981c-dad6-4908-9805-8bbcbbb8f706',
    'malro.org',
    'published',
    '2023-08-01T12:13:05.479Z',
    '["malro.org"]',
    4.41134023666382,
    45.0113182067871,
    'FR',
    '84000',
    'Avignon',
    'Cathédrale Notre-Dame',
    'Europe/Paris',
    '["concert","festival","classical"]',
    0,
    99,
    45,
    'true',
    '2023-06-18T12:45',
    '[{"data":"https://www.ticket-festival.fr","allows_affiliate_partnership":null,"type":"url"}]',
    NULL,
    'http://localhost:3000/datastore/images/29b4981c-dad6-4908-9805-8bbcbbb8f706.webp?v=1692082337459',
    NULL,
    'EUR',
    '[{"lang":"fr","url":"https://www.example.org","title":"God Save The Prince!","organizer":"Le Festival de Provence","content":"Dans la lignée d''un magnifique enregistrement paru en 2022, Hervé Niquet et Le Concert Spirituel reviennent cette année pour une soirée d''ouverture à la cathédrale Notre-Dame du Puy consacrée à Haendel et ses célèbres Coronation Anthems, au premier rang duquel figure Zadok the Priest, ainsi que le Dettingen Te Deum.","detail":"Dans la lignée d''un magnifique enregistrement paru en 2022, Hervé Niquet et Le Concert Spirituel reviennent cette année pour une soirée d''ouverture à la cathédrale Notre-Dame du Puy consacrée à Haendel et ses célèbres Coronation Anthems, au premier rang duquel figure Zadok the Priest, ainsi que le Dettingen Te Deum."},{"lang":"en","url":"https://www.example.org","title":"God Save The King!","organizer":"Le Festival de Provence","content":"In line with a magnificent recording released in 2022, Hervé Niquet and Le Concert Spirituel return this year for an opening night at Notre-Dame du Puy Cathedral dedicated to Handel and his famous Coronation Anthems, in the forefront of which is Zadok the Priest, as well as the Dettingen Te Deum.","detail":"In line with a magnificent recording released in 2022, Hervé Niquet and Le Concert Spirituel return this year for an opening night at Notre-Dame du Puy Cathedral dedicated to Handel and his famous Coronation Anthems, in the forefront of which is Zadok the Priest, as well as the Dettingen Te Deum."}]',
    '[{"adult_fee":45,"child_fee":45,"feature":null,"audio_lang":"fr","start":"2023-09-28T20:00","end":"2023-09-28T22:00"},{"adult_fee":0,"child_fee":0,"feature":null,"audio_lang":null,"start":"2023-09-29T20:00","end":"2023-09-29T22:00"},{"adult_fee":45,"child_fee":45,"feature":null,"audio_lang":null,"start":"2023-09-30T20:00","end":"2023-09-30T22:00"}]',
    'contact@example.com',
    NULL
  );

COMMIT;
