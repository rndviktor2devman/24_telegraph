from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from server import app
from posts import db

app.config.from_pyfile('config.py')
app.config.from_envvar('APP_CONFIG_FILE')

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()
