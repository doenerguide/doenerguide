# a script, that pulls the latest version of the backend from github and logs the output

import os
import subprocess

# change to the /mnt/web310/b1/02/512442602/htdocs/doenerguide directory
os.chdir("/mnt/web310/b1/02/512442602/htdocs/doenerguide")

# pull the latest version from github
process = subprocess.Popen(["git", "pull"], stdout=subprocess.PIPE)
output = process.communicate()[0]

# write the output to the log file
with open("log.txt", "a") as logfile:
    logfile.write(output)

# print the output to the console
print(output)