import subprocess
command = 'ssh xn--dnerguide-07a.de@ssh.strato.de "cd /mnt/web310/b1/02/512442602/htdocs/doenerguide && git pull"'
process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, text=True)