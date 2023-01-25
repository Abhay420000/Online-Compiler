import os
import shutil
import signal
import subprocess


class RunCode:
    def __init__(self, option, dir):
        self.c_list = {
            "python": [f"python3 '{dir}//code.py' <'{dir}//input' >'{dir}//output' 2>'{dir}//error'"],                           
            "c++": [f"g++ '{dir}/code.cpp' -o '{dir}/a.out'", f"'{dir}/a.out' <'{dir}/input' >'{dir}/output' 2>'{dir}/error'"],
        }

        #"java": [f"javac '{dir}//Main.java'", f"java '{dir}//Main' <'{dir}/input' >'{dir}/output' 2>'{dir}/error'"],                         

        self.option = option                                                     

        self.out = open(f"{dir}//output", 'rb')
        
        self.inf = open(f"{dir}//input",'rb')

        self.err = open(f"{dir}//error",'rb')

        self.time_up = False

    def run(self):
        """
            Runs the code
        """
        for command in self.c_list[self.option]:
            self.proc = subprocess.Popen(command, shell=True, preexec_fn=os.setsid)                
            print("Command: ",command)
            try:
                if self.option == "python":
                    self.proc.wait(timeout = 0.1)
                elif self.option == "c++":
                    self.proc.wait(timeout = 1)
            except subprocess.TimeoutExpired:
                os.killpg(os.getpgid(self.proc.pid), signal.SIGKILL)
                self.time_up = True

    def get_out(self):
        """
            Returns the Output
        """
        return self.out.read()
    
    def get_err(self):
        """
            Return the error
        """
        err = self.err.read()
        self.err.seek(0)
        print(err)
        return err
    
    def status(self):
        """
            Returns the status of process
        """
        try:
            error = self.err.readlines()[-1]
        except IndexError:
            error = None
        
        self.err.seek(0)
        if error == b'EOFError: EOF when reading a line\n':                                                  
            #Input Required
            return 1
        elif self.time_up == True:
            print("Time_UP")
            return 0
        else:
            #Process Completed With OR WithOut Error
            return 2
    
    def output_check(self):
        out_len = len(self.out.read())
        self.out.seek(0)
        if  out_len> 5000:
            return "Output Overload"
        return "OK"


def delete_assigned_dir(dir):
    shutil.rmtree(dir)
    to_rem = dir.split("//")[-1]
    working_dirs.remove(int(to_rem))
    available_dirs.append(int(to_rem))
    print("Working Dirs: ",working_dirs)
    print("Available Dirs: ", available_dirs)

def execute(lang, code, input):
    rout = {}
    """
    eg = {
        "status": 1(Input Required) | 2(Executed Completely with error or without error),
        "output": "Enter a number:"
        "end": 1(Completed)|0(Pending)
    }
    """
    dir_name = available_dirs.pop(0)
    working_dirs.append(dir_name)

    dir = f"{base_dir}//{dir_name}"
    os.mkdir(dir)

    #Writing Input to Input File
    input_file = open(f"{dir}//input", 'w')
    input_file.write(input)
    input_file.close()

    open(f"{dir}//output", 'w').close()
    open(f"{dir}//error", 'w').close()

    if lang == "Python":
        file = open(f"{dir}//code.py", 'w')
        file.write(code)
        file.close()
        rc = RunCode("python", dir)
    elif lang == "Java":
        file = open(f"{dir}//Main.java", 'w')
        file.write(code)
        file.close()
        rc = RunCode("java", dir)
    elif lang == "C++":
        file = open(f"{dir}//code.cpp", 'w')
        file.write(code)
        file.close()
        rc = RunCode("c++", dir)
    
    rc.run()
    
    status = rc.status()
    print("Status:", status)
    if (status == 1 or status == 2):
        rout["status"] = status

        if (status == 1):
            rout["output"] = rc.get_out().decode('ascii')
            rout["end"] = 0
        elif (status == 2):
            rout["output"] = rc.get_out().decode('ascii')+"\n"+rc.get_err().decode('ascii')
            rout["end"] = 1
        delete_assigned_dir(dir)
        return rout
            
    elif status == 0:
        if (rc.output_check() != "OK"):
            rout["status"] = 0
            rout["output"] = rc.get_out().decode('ascii')[1:1000]+rc.get_err().decode('ascii')+"\nOutput Overload"                                                          
            rout["end"] = 1
            delete_assigned_dir(dir)
            return rout
        if (rc.time_up == True):
            rout["status"] = 0
            rout["output"] = rc.get_out().decode('ascii')+rc.get_err().decode('ascii')+"\nOver Time"
            rout["end"] = 1
            delete_assigned_dir(dir)
            return rout

base_dir = os.path.dirname(__file__)
working_dirs = []
available_dirs = [x for x in range(1,5)]

if __name__ == "__main__":
    import os
    print(os.getcwd())
    code = open("hello.py",'r').read()
    print(code)
    print(execute("Python", code, "1\n3\n\n"))
    #b = RunCode("python", "/media/kalimb/Local Disk/Computer Science/KLinuex/test")                 
    #execute(b)

    """
    while True:
        print("Options:")
        print("1.Enter Input:")
        print("2.Display Output")
        print("3.Run")
        op = input("Enter Option:")
        if op == '1':
            a = input("Enter:")
            b.inp(a)
        elif op == '2':
            print(b.get_out())
        elif op == '3':
            b.run()
    """
