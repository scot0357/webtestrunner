import sys
import nose

sys.path.insert(0, '/tmp')

a = __import__('test')


print nose.run(module=a)