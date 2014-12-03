"""Run the main tornado application.

"""

import tornado.web
import tornado.ioloop
import os
import webhandler
import apihandler

DIRNAME = os.path.dirname(os.path.abspath(__file__))
SETTINGS = {
    'debug': True,
    'static_path': os.path.join(DIRNAME, 'static'),
    'template_path': os.path.join(DIRNAME, 'templates'),
}


def get_application():
    """Return the tornado application ready to run.

    """
    handlers = [
        (r'/', webhandler.WebHandler),
        (r'/api', apihandler.APIHandler)
    ]
    application = tornado.web.Application(handlers=handlers,
                                          **SETTINGS)

    return application


def main():
    """Run the tornado application.

    """
    application = get_application()
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
