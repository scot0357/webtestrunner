import tornado.websocket
import sys
import nose
import subprocess
import tempfile
import os
import xml.etree.ElementTree as ET


class APIHandler(tornado.web.RequestHandler):

    def run_nosetests(self, directory, module):
        _, tmpfile = tempfile.mkstemp()
        cmd = ['nosetests', '-w', directory, module, '--with-xunit',
               '--xunit-file', tmpfile]
        print cmd
        process = subprocess.Popen(cmd)
        process.wait()
        xml_object = ET.parse(tmpfile)
        os.unlink(tmpfile)
        return xml_object

    def process_nose_result(self, xml_object):
        root = xml_object.getroot()
        tests = root.attrib['tests']
        errors = root.attrib['errors']
        failures = root.attrib['failures']
        skipped = root.attrib['skip']

        status = {
            'status': {
                'tests': tests,
                'errors': errors,
                'failures': failures,
                'skipped': skipped
            },
            'test_cases': []
        }

        for test_case in root.findall('testcase'):
            test_name = test_case.attrib['name']
            test_time = test_case.attrib['time']
            class_name = test_case.attrib['classname']

            try:
                system_out = test_case.find('system-out').text
            except AttributeError:
                system_out = None

            try:
                failure_info = test_case.find('failure').text
                failure_type = test_case.find('failure').attrib['type']
            except (AttributeError, KeyError):
                failure_info = None
                failure_type = None

            try:
                error_info = test_case.find('error').text
                error_type = test_case.find('error').attrib['type']
            except (AttributeError, KeyError):
                error_info = None
                error_type = None

            status['test_cases'].append({
                'test_name': test_name,
                'test_time': test_time,
                'class_name': class_name,
                'stdout': system_out,
                'failure': bool(failure_info),
                'failure_info': failure_info,
                'failure_type': failure_type,
                'error': bool(error_info),
                'error_info': error_info,
                'error_type': error_type,
            })

        return status

    def get(self):
        path = self.get_argument('path', None)
        module = self.get_argument('module', None)

        xml_object = self.run_nosetests(path, module)
        status = self.process_nose_result(xml_object)
        self.write(status)
