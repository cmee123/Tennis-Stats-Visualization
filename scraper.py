import requests
from bs4 import BeautifulSoup
import json

class Player():
    def __init__(self, first, last, url, stats):
        self.first = first
        self.last = last
        self.url = url
        self.stats = stats

players_list = [
    Player("Roger", "Federer", "https://www.atptour.com/en/players/roger-federer/f324/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Rafael", "Nadal", "https://www.atptour.com/en/players/rafael-nadal/n409/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Novak", "Djokovic", "https://www.atptour.com/en/players/novak-djokovic/d643/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Daniil", "Medvedev", "https://www.atptour.com/en/players/daniil-medvedev/mm58/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Alexander", "Zverev", "https://www.atptour.com/en/players/alexander-zverev/z355/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Stefanos", "Tsitsipas", "https://www.atptour.com/en/players/stefanos-tsitsipas/te51/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Matteo", "Berrettini", "https://www.atptour.com/en/players/matteo-berrettini/bk40/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Andrey", "Rublev", "https://www.atptour.com/en/players/andrey-rublev/re44/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Casper", "Ruud", "https://www.atptour.com/en/players/casper-ruud/rh16/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Felix", "A-A", "https://www.atptour.com/en/players/felix-auger-aliassime/ag37/player-activity?year=all", {"wins": [], "losses": []}),
    Player("Jannik", "Sinner", "https://www.atptour.com/en/players/jannik-sinner/s0ag/player-activity?year=all", {"wins": [], "losses": []}),
]



def get_data(players_list):
    stats = {}
    # for each player we are interested in 
    for player in players_list:
        # set up soup for first page
        page = requests.get(player.url)
        soup = BeautifulSoup(page.content, 'html.parser')

        # find all of their tournaments in that period
        tournaments = soup.find_all("table", class_="mega-table")
        num_of_tournaments = len(tournaments)

        # set the stat values
        match_result = ""
        match_round = ""


        # For each tournament in their career (right now just 2021)
        for i in range(3, (3*num_of_tournaments+1), 3):
            year_played = soup.find_all("tbody")[i-2].find_all("span", class_="tourney-dates")[0].text.strip()[0:4]
            month_played = soup.find_all("tbody")[i-2].find_all("span", class_="tourney-dates")[0].text.strip()[5:7]
            # for each match in the tournament
            for k in soup.find_all("tbody")[i].find_all("tr"):
                page2 = ""
                # append the round and result to a list
                match_result = k.find_all("td")[3].text.strip()
                match_round = k.find_all("td")[0].text.strip()
                match_sets = k.find_all("td")[4].text.strip().count(" ") + 1
            
                if match_round != "" and match_result != "":
                    oponent = k.find_all("td")[2].find_all("a", class_="mega-player-name")[0].text.strip()
                    oponent_rank = k.find_all("td")[1].text.strip()
                    if match_result == "W":
                        player.stats["wins"].append([year_played, month_played, match_result, match_round, oponent, oponent_rank, match_sets])
                    elif match_result == "L":
                        player.stats["losses"].append([year_played, month_played, match_result, match_round, oponent, oponent_rank, match_sets])

        stats[player.first] = player.stats
    return stats


final_data = get_data(players_list)

#matches_played = len(final_data[players_list[0].first]["wins"] + final_data[players_list[0].first]["losses"])
#win_pct = final_data[players_list[0].first]["wins"] / matches_played




with open("data.json", "w") as output:
    json.dump(final_data, output)





# potential code for finding serve stats

# find the serve stats for that match
# make sure result is not walkover or bye
#if k.find_all("td")[4].text.strip() != "" and k.find_all("td")[4].text.strip() != "(W/O)":
#    # set up soup for second page (where we get serve %)
#    try:
#        page2 = requests.get("https://www.atptour.com/" + k.find_all("td")[4].find_all("a", href=True)[0]["href"])
#    # handle if the link is not clickable
#    except IndexError:
#        continue
#
#    soup2 = BeautifulSoup(page2.content, 'html.parser')
#    print(soup2)
#    try:
#        if match_result == "L":
#            print("-----")
#            print("loss")
#            serve_pct = soup2.find_all("td", class_="match-stats-number-right")[3].span.text.strip()[:-1]
#        elif match_result == "W":
#            print("-----")
#            print("win")
#            serve_pct = soup2.find_all("td", class_="match-stats-number-left")[3].span.text.strip()[:-1]
#    except IndexError:
#        print("weird results")
#        # TODO: New Code Here
#        if match_result == "L":
#            print(soup2.find_all("div", class_="clickable-stats"))
#        elif match_result == "W":
#            print(soup2.find_all("div", class_="clickable-stats"))
