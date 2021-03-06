import monster from './monster.js';
let weapon = null;

export default {
    create: ({ game }) => {
        //visual
        weapon = game.add.weapon(30, 'projectile');
        weapon.addBulletAnimation('shoot', [0, 1, 2, 3], 15, true);

        //game
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        weapon.bulletSpeed = 1000;
        weapon.fireRate = 100;
        weapon.bulletAngleVariance = 2;
        weapon.damage = 12;

        //audio
        weapon.audio = game.add.audio('shoot');

        return weapon;

    },
    update: ({ game, mGroup, weapon }) => {
        // collision (monster & bullet)
        game.physics.arcade.overlap(mGroup, weapon.bullets, (m, b) => {
            // visual
            b.damage(m.health); // it will auto kill() bullet upon 0 hp
            m.tint = 0xff0000;
            setTimeout(() => { m.tint = 0xffffff; }, 50);

            // game
            m.damage(weapon.damage);
            if (!m.alive && m.lives === 1) {
                m.kill();
                m.audio.pop.play();
                return;
            }
            if (!m.alive) {
                let m1 = monster.create({ game, x: m.x, y: m.y, lives: m.lives - 1 })
                m1.body.velocity.set(-200, _.random(-200, 0));
                game.monsterGroup.add(m1);

                let m2 = monster.create({ game, x: m.x, y: m.y, lives: m.lives - 1 })
                m2.body.velocity.set(200, _.random(-200, 0));
                game.monsterGroup.add(m2);

                m.kill();
                m.audio.pop.play();
            }
        })
    }
}