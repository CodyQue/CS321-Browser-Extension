#This is for creating professor URLs from ratemyprof
f = open('test.txt', 'r')
n = open('profNames.txt', 'w')
for line in f:
    x = line.split(" ")
    if (len(x) >= 2):
        profName = ''
        URL = ''
        firstHalfURL = "https://www.ratemyprofessors.com/search/teachers?query="
        secondHalfURL = "%20"
        if (x[1][-1] != ','):
            profName = x[1] + ' ' + x[2][:-1] + ' ' + x[0][:-1]
            URL = firstHalfURL + x[1] + secondHalfURL + x[0][:-1]
        else:
            profName = x[1][:-1] + ' ' + x[0][:-1]
            URL = firstHalfURL + x[1][:-1] + secondHalfURL + x[0][:-1]
        n.write(profName + " " + URL + "\n")
f.close()
n.close()
