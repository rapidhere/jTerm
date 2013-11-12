#!/usr/bin/python

import simplejson as json
import os

build_dir = './jTerm'
std_target_file = 'jterm.jquery.js'
min_target_file = 'jterm.jquery.min.js'
arch_file = "__arch__.json"


class BuildResult:
    _dump_flag = None

    def __init__(self, obj):
        self._obj = obj

    def dump_string(self):
        scanner = getattr(self, "_scanner_" + self._dump_flag)
        
        if type(self._obj) == list:
            # Build Directory
            return ''.join([br.dump_string() for br in self._obj])
        else:
            # Build File
            return self._scanner_std(self._obj)

    def dump(self, file_name):
        target = file(file_name, "w")
        target.write(self.dump_string())

    @staticmethod
    def build(directory, flag):
        BuildResult._dump_flag = flag
        return BuildResult._build_dir(directory)
    
    @staticmethod
    def _scanner_std(f):
        return file(f).read()
    
    @staticmethod
    def _scanner_min(f):
        # Not implemented
        return _scanner_std(f)
    
    @staticmethod
    def _build_file(f):
        if not os.path.isfile(f):
            raise ValueError("File `%s' not found!", f)

        return BuildResult(f)

    @staticmethod
    def _build_dir(directory):
        if not os.path.isdir(directory):
            raise ValueError("Diectory `%s' not found!", directory)

        ar_path = os.path.join(directory, arch_file)
        if not os.path.isfile(ar_path):
            raise ValueError("architecture file not found under `%s'", directory)
        
        br = BuildResult([])
        for t in json.loads(file(ar_path).read()):
            t = os.path.join(directory, t)
            if os.path.isfile(t):
                br._obj.append(BuildResult._build_file(t))
            elif os.path.isdir(t):
                br._obj.append(BuildResult._build_dir(t))

        return br


def main():
    import sys
    ret = None
    target = None
    
    if len(sys.argv) < 2:
        sys.exit(1)

    if sys.argv[1] == 'std':
        ret = BuildResult.build(build_dir, 'std')
        target = std_target_file
    elif sys.argv[1] == 'min':
        ret = BuildResult.build(build_dir, 'min')
        target = min_target_file
    else:
        sys.exit(1);

    ret.dump(target)

if __name__ == "__main__":
    main()
